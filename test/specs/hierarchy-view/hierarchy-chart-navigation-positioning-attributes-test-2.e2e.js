const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const flattenHierarchyObj = require('../../utilities/flatten-hierarchy-obj')

let hierarchyObj, chartObj;

describe('Hierarchy Chart Navigation - Positioning Attributes - Test 2', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select the first 5 brands from the list available and click "Next" button`, async function () {
        await brandSelectorPage.selectFirstFiveBrands();
        brandNamesSelectedDuringFlow = await brandSelectorPage.getSelectedBrands();
        await brandSelectorPage.clickNextButton();
    })

    it(`Audience Details - click the "Save & Finish" button`, async function () {
        await audienceDetailsPage.clickSaveAndFinishButton();
    })

    it(`Confirm that home page is displayed`, async function () {
        let brandEquitySummaryTable = await overviewPage.getNumericSummaryValues();
        // console.log(`\n\n brandEquitySummaryTable => \n${JSON.stringify(brandEquitySummaryTable, null, 4)}\n\n`)
        assert.notEqual(brandEquitySummaryTable["Brand Equity"]["BERA Score"], '');
    })

    it(`Navigate to Brand Positions Stage`, async function () {
        await navBar.clickBrandPositioning();
        let isBrandPositioningDisplayed = await brandPositioningPage.isBrandPositioningHeaderDisplayed()
        // console.log(`isRelStageDisplayed => ${isRelStageDisplayed}`);
        assert.equal(isBrandPositioningDisplayed, true, "Brand positioning is not displayed")
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true, "Hierarchy banner is not displayed")
    })

    it(`scrape chart for values`, async function () {
        await brandPositioningPage.clickChartViewButton();
        chartObj = await brandPositioningPage.scrapeChart();
        // fs.writeFileSync('./chart-obj.json', JSON.stringify(chartObj, null, 4));
    })

    it(`Scrape hieararchy for values`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
        console.log('!!! hierarchy obj =>', JSON.stringify(hierarchyObj, null, 4));
        // fs.writeFileSync('./hierarchy-obj.json', JSON.stringify(hierarchyObj, null, 4))
    })

    it(`Verify that there exists the “View More” button the Purpose and Emotional Constructs`, async function () {
        let emotionalReadMore = await brandPositioningPage.getConstructReadMoreElement("Emotional");
        let purposeReadMore = await brandPositioningPage.getConstructReadMoreElement("Purpose");

        assert.equal(await emotionalReadMore.isExisting(), true, "Emotional Read More Element does not exist.");
        assert.equal(await purposeReadMore.isExisting(), true, "Purpose Read More Element does not exist.");
    })

    it(`Verify that the Purpose and Emotional Constructs are displayed`, async function () {
        let emotionalConstructDisplayed = await brandPositioningPage.isConstructDisplayed("Emotional");
        let purposeConstructDisplayed = await brandPositioningPage.isConstructDisplayed("Purpose");

        assert.equal(emotionalConstructDisplayed, true, "Emotional construct is not displayed.");
        assert.equal(purposeConstructDisplayed, true, "Purpose construct is not displayed.");
    })

    it(`Verify that the correct colors are assigned to the constructs: All Purpose metrics are apricot, All Emotional metrics are orange. Verify that no other colors or shades of Apricot or Orange are used.`, async function () {
        let flattenedObjArr = flattenHierarchyObj(hierarchyObj);
        // fs.writeFileSync('./flattenedObj.json', JSON.stringify(flattenedObjArr, null, 4))

        let index = flattenedObjArr.findIndex(el => el.pillarName === "Purpose");
        let emotionalArr = flattenedObjArr.slice(0, index);
        let purposeArr = flattenedObjArr.slice(index);

        let everyEmotionalColourIsOrange = emotionalArr.every(el => el.color.value === "rgb(251,120,45)")
        let everyPurposeColourIsApricot = purposeArr.every(el => el.color.value === "rgb(255,187,0)")

        assert.equal(everyEmotionalColourIsOrange, true, "Not All Emotional Constructs are Orange");
        assert.equal(everyPurposeColourIsApricot, true, "Not All Purpose Constructs are Apricot");
    })

    it(`Verify that the Brand Positioning Attributes are listed alphabetically`, async function () {
        let flattened = flattenHierarchyObj(hierarchyObj);
        // fs.writeFileSync(`./flattened.json`, JSON.stringify(flattened, null, 4))
        flattened = flattened.reverse()
        let clonedArr = JSON.parse(JSON.stringify(flattened));
        clonedArr.sort((a, b) => {
            if (a.pillarName < b.pillarName) { return 1; }
            else { return -1; }
        })

        let sorted = true;
        flattened.forEach(el => {
            let filteredOriginal = flattened.filter((flatEl) => {
                let match = true;
                el.parents.forEach((parent, i) => {
                    if (parent !== flatEl.parents[i]) {
                        match = false;
                    }
                })
                if (match) {
                    return flatEl;
                }
            })

            let filteredClone = clonedArr.filter(cloneEl => {
                let match = true;
                el.parents.forEach((parent, i) => {
                    if (parent !== cloneEl.parents[i]) {
                        match = false;
                    }
                })
                if (match) {
                    return cloneEl;
                }
            })
            if (filteredClone.length != filteredOriginal.length || filteredOriginal.every((el, i) => el.pillarName != filteredClone[i].pillarName)){
                sorted = false;
            }
        })
        assert.equal(sorted, true, "Constructs do not appear in alphabetical order.")
    })

})
