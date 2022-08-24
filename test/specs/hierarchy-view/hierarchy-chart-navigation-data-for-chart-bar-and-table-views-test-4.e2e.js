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

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true, "Hierarchy banner is not displayed")
    })

    it(`scrape chart for values`, async function (){
        await brandPositioningPage.clickChartViewButton();
        chartObj = await brandPositioningPage.scrapeChart();
    })

    it(`Scrape hieararchy for values`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
        console.log('!!! hierarchy obj =>', JSON.stringify(hierarchyObj, null, 4));
    })

    it(`Scrape table for values`, async function () {
        await brandPositioningPage.clickTableViewButton();
        tableObj = await brandPositioningPage.scrapeAllForPrimaryBrand();
        console.log(`table obj => `, JSON.stringify(tableObj, null, 4));
        // fs.writeFileSync('./zzz.table-obj.json', JSON.stringify(tableObj, null, 4));
    })

    it(`Verify that the percentile score values match for chart view and table view for the Purpose and Emotional constructs`, async function () {
       let primaryBrand = chartObj.find(el => el.primaryBrand)

       assert.equal(primaryBrand.emotionalPercentage, tableObj["Overview"]["values"]["Emotional"], "Table view and Chart view do not match values for emotional percentage")
       assert.equal(primaryBrand.purposePercentage, tableObj["Overview"]["values"]["Purpose"], "Table view and Chart view do not match values for purpose percentage")
    })

    it(`Verify that the percentile score values match for Hierarchy chart and Table view for the Purpose and Emotional constructs`, async function () {
        let primaryBrand = chartObj.find(el => el.primaryBrand);
        let emotionalHierarchy = hierarchyObj.children.find(child => child.pillarName=== "Emotional")
        let purposeHierarchy = hierarchyObj.children.find(child => child.pillarName=== "Purpose")

        assert.equal(parseFloat(primaryBrand.emotionalPercentage), emotionalHierarchy.percentage)
        assert.equal(parseFloat(primaryBrand.purposePercentage), purposeHierarchy.percentage)
    })
})