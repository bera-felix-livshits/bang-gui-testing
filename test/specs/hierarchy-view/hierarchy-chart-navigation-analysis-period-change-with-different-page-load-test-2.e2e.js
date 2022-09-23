const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const analysisPeriodSelectorAndFilters = require('../../page-objects/page-components/analysis-period-selector-and-filters.js');

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let oldTimePeriod, hierarchyObj;

describe('Hierarchy Chart Navigation - Analysis Period Change w/ Different page load - Test 2', () => {
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
        assert.equal(isBrandPositioningDisplayed, true, "Brand positioning is not displayed")
    })
    
    it(`Change the Analysis Period to a different year`, async function () {
        await brandPositioningPage.clickAnalysisPeriodDropDown();
        await brandPositioningPage.setIntervalOrAnalysisPeriodInDropdown("Last 2 Years");
        oldTimePeriod = await brandPositioningPage.getDisplayedAnalysisPeriodText();
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed();
        assert.equal(isBannerDisplayed, true, "Hierarchy banner is not displayed");
    })

    it(`Capture Hierarchy Pillar values`, async function () {
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
    })

    it(`Verify that Hierarchy Chart is displaying new Analysis Period`, async function () {
        let hierarchyTimePeriodAnalysis = await brandPositioningPage.getDisplayedAnalysisPeriodText();
        console.log("hierarchyTimePeriodAnalysis =>", hierarchyTimePeriodAnalysis)
        assert.deepEqual(oldTimePeriod, hierarchyTimePeriodAnalysis, "Time period values are not correct for Hierarchy Chart View");
    })

    it('Navigate to Overview', async function (){
        await navBar.clickOverview();
        let overviewTimePeriodAnalysis = await analysisPeriodSelectorAndFilters.getDisplayedAnalysisPeriodText();
        assert.deepEqual(oldTimePeriod, overviewTimePeriodAnalysis, "Selected time period not consistent between page loads.")
    })
   

})