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

describe('Hierarchy Chart Navigation - Positioning Attributes - Test 1', () => {
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

    it(`Verify that the percentile score values match for Hierarchy chart and Table view for the Purpose and Emotional constructs`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();

        let purposePercentage = await brandPositioningPage.getConstructBoxPercentageFill("Purpose");
        let emotionalPercentage = await brandPositioningPage.getConstructBoxPercentageFill("Emotional");

        let primaryBrandKeyPurpose = Object.keys(chartObj["Overview"]["Purpose"]).find(key => chartObj["Overview"]["Purpose"][key].primaryBrand)
        let primaryBrandPurpose = chartObj["Overview"]["Purpose"][primaryBrandKeyPurpose];

        let primaryBrandKeyEmotional = Object.keys(chartObj["Overview"]["Emotional"]).find(key => chartObj["Overview"]["Emotional"][key].primaryBrand)
        let primaryBrandEmotional = chartObj["Overview"]["Emotional"][primaryBrandKeyEmotional];
        

        assert.equal(parseFloat(primaryBrandEmotional.percentage), emotionalPercentage)
        assert.equal(parseFloat(primaryBrandPurpose.percentage), purposePercentage)
    })

    it(`Confirm and validate that when a construct is selected that the construct no longer is visually represented as a percentage`, async function () {
        
        await brandPositioningPage.clickConstructBox("Purpose");
        let purposePercentage = await brandPositioningPage.getConstructBoxPercentageFill("Purpose");
        await brandPositioningPage.clickConstructBox("Purpose");
        
        await brandPositioningPage.clickConstructBox("Emotional");
        let emotionalPercentage = await brandPositioningPage.getConstructBoxPercentageFill("Emotional");
        await brandPositioningPage.clickConstructBox("Emotional");

        assert.equal(purposePercentage, 100, "Purpose construct does not fill up the entirety of the background character")
        assert.equal(emotionalPercentage, 100, "Emotional construct does not fill up the entirety of the background character")
    })
})