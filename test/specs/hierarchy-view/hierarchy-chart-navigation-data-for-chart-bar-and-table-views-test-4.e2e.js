const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let tableObj, hierarchyObj, chartObj;

describe('Hierarchy Chart Navigation - Data for Chart, Bar, and Table Views - Test 4', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    
    it(`Select the "US Brandscape" dataset.`, async function () {
        await filtersSideBar.selectDataSet("US Brandscape");
    })

    it(`Select 5 brands from the list available`, async function () {
        await filtersSideBar.addPrimaryBrand("Coleman (active gear)");
        await filtersSideBar.addCompetitiveSetBrands([
            "Contigo",
            "Corkcicle",
            "Hydro Flask",
            "Igloo (coolers)"
        ])

        await filtersSideBar.clickCloseFiltersButton();
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