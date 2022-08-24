const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let tableObj, hierarchyObj, chartObj;

describe('Hierarchy Chart Navigation - Brand Positioning - More Button Test 2', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
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
        let isBrandPositioningDisplayed = await brandPositioningPage.getBrandPositioningHeader()
        // console.log(`isRelStageDisplayed => ${isRelStageDisplayed}`);
        assert.equal(isBrandPositioningDisplayed, true, "Brand positioning is not displayed")
    })

    it(`Verify that for every brand "Purpose" comes before "Emotional"`, async function () {
        let elems = await brandPositioningPage.getAllChartEntryElements();
        console.log('elems.length =>', elems.length)
        let entryNames = await Promise.all(elems.map(async el => {
            return await el.getAttribute("name");
        }))

        console.log("entryNames => ", entryNames)
        let midPoint = entryNames.length / 2;
        console.log('midPoint =>', midPoint);
        let firstArrNames = entryNames.slice(0, midPoint);
        let secondArrNames = entryNames.slice(midPoint, entryNames.length);

        console.log("firstArrNames =>", firstArrNames)
        console.log("secondArrNames =>", secondArrNames)

        assert.equal(firstArrNames.every(el => el == "purpose"), true, "The first column that is displayed are not all 'purpose'");
        assert.equal(secondArrNames.every(el => el == "emotional"), true, "The first column that is displayed are not all 'emotional'");
    })
})