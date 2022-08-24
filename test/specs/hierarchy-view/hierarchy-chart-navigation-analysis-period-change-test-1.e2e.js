const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const analysisPeriodSelectorAndFilters = require('../../page-objects/common-components/analysis-period-selector-and-filters.js');

let newTimePeriod, oldTimePeriod, hierarchyObj, newHierarchyObj;

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
    
    it(`Change the Analysis Period to a different year`, async function () {
        await brandPositioningPage.clickAnalysisPeriodDropDown();
        await brandPositioningPage.setIntervalOrAnalysisPeriodInDropdown("Last Year");
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed();
        oldTimePeriod = await brandPositioningPage.getDisplayedAnalysisPeriodText();
        assert.equal(isBannerDisplayed, true, "Hierarchy banner is not displayed");
    })

    it(`Capture Hierarchy Pillar values`, async function () {
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
    })

    it(`Change the Analysis Period to a different year`, async function () {
        await brandPositioningPage.clickAnalysisPeriodDropDown();
        await brandPositioningPage.setIntervalOrAnalysisPeriodInDropdown("Last 2 Years");
        newTimePeriod = await brandPositioningPage.getDisplayedAnalysisPeriodText();
        console.log('new time period =>', newTimePeriod)
    })

    it(`Verify that Hierarchy Chart is displaying new Analysis Period`, async function () {
        let hierarchyTimePeriodAnalysis = await brandPositioningPage.getDisplayedAnalysisPeriodText();
        console.log("hierarchyTimePeriodAnalysis =>", hierarchyTimePeriodAnalysis)
        assert.equal(JSON.stringify(newTimePeriod), JSON.stringify(hierarchyTimePeriodAnalysis), "Time period values are not correct for Hierarchy Chart View");
    })

    it(`Verify that new Analysis Period adjusts the values on the Hierarchy Chart`, async function () {
        newHierarchyObj = await brandPositioningPage.generatePillarsObj();
        assert.notDeepEqual(hierarchyObj, newHierarchyObj, "New Pillar values are not updated upon changing Analysis Period")
    })

    it(`Change the Analysis Period back to this year`, async function () {
        await brandPositioningPage.clickAnalysisPeriodDropDown();
        await brandPositioningPage.setIntervalOrAnalysisPeriodInDropdown("Last Year");
        let origTimePeriod = await brandPositioningPage.getDisplayedAnalysisPeriodText();
        console.log("origTimePeriod => ", origTimePeriod)
        assert.equal(JSON.stringify(oldTimePeriod), JSON.stringify(origTimePeriod), "Time period was not changed")
    })

    it(`Capture Hierarchy Pillar values back at original Time Period Interval`, async function (){
        newHierarchyObj = await brandPositioningPage.generatePillarsObj();
        assert.deepEqual(hierarchyObj, newHierarchyObj, "Pillar Values should have the same values, but do not")
    })

})