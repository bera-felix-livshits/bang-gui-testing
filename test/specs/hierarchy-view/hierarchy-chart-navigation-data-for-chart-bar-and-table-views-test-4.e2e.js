const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let tableObj, hierarchyObj, chartObj;

describe('Hierarchy Chart Navigation - Data for Chart, Bar, and Table Views - Test 4', () => {
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
    })

    it(`Scrape hieararchy for values`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
    })

    it(`Scrape table for values`, async function () {
        await brandPositioningPage.clickTableViewButton();
        tableObj = await brandPositioningPage.scrapeAllForPrimaryBrand();
    })

    it(`Verify that the percentile score values match for chart view and table view for the Purpose and Emotional constructs`, async function () {

        let primaryBrandEmotionalKey = Object.keys(chartObj["Overview"]["Emotional"]).find(key => chartObj["Overview"]["Emotional"][key].primaryBrand)
        let primaryBrandEmotional = chartObj["Overview"]["Emotional"][primaryBrandEmotionalKey];

        let primaryBrandPurposeKey =  Object.keys(chartObj["Overview"]["Purpose"]).find(key => chartObj["Overview"]["Purpose"][key].primaryBrand);
        let primaryBrandPurpose = chartObj["Overview"]["Purpose"][primaryBrandPurposeKey];

        assert.equal(parseFloat(primaryBrandEmotional.percentage) , tableObj["Overview"]["values"]["Emotional"], "Table view and Chart view do not match values for emotional percentage")
        assert.equal(parseFloat(primaryBrandPurpose.percentage) , tableObj["Overview"]["values"]["Purpose"], "Table view and Chart view do not match values for purpose percentage")
    })

    it(`Verify that the percentile score values match for Hierarchy chart and Table view for the Purpose and Emotional constructs`, async function () {
        let primaryBrandEmotionalKey = Object.keys(chartObj["Overview"]["Emotional"]).find(key => chartObj["Overview"]["Emotional"][key].primaryBrand)
        let primaryBrandEmotional = chartObj["Overview"]["Emotional"][primaryBrandEmotionalKey];

        let primaryBrandPurposeKey =  Object.keys(chartObj["Overview"]["Purpose"]).find(key => chartObj["Overview"]["Purpose"][key].primaryBrand);
        let primaryBrandPurpose = chartObj["Overview"]["Purpose"][primaryBrandPurposeKey];

        let emotionalHierarchy = hierarchyObj.children.find(child => child.pillarName === "Emotional")
        let purposeHierarchy = hierarchyObj.children.find(child => child.pillarName === "Purpose")

        assert.equal(parseFloat(primaryBrandEmotional.percentage), emotionalHierarchy.percentage)
        assert.equal(parseFloat(primaryBrandPurpose.percentage), purposeHierarchy.percentage)
    })
})