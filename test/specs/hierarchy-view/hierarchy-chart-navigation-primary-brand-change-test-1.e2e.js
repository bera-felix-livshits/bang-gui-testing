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

let hierarchyObj, newBrandHierarchy;

describe('Hierarchy Chart Navigation - Primary Brand Change - Test 1', () => {
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

    it(`Enable sample size`, async function (){
        await brandPositioningPage.toggleSampleSize();
        let sampleSizeBefore = await brandPositioningPage.getSampleSizeAttributes()
        console.log('before sample size =>', sampleSizeBefore);

    })

    it(`Click filters drop down and select "Edit" Primary Audience element`,async function (){
        await analysisPeriodSelectorAndFilters.clickFiltersButton();
        await analysisPeriodSelectorAndFilters.clickEditPrimaryAudienceButton();   
    })

    it(`Verify that you are presented with the "Audience Details Page"`, async function(){
        assert.equal((await audienceDetailsPage.getSelectedAudience()).toLowerCase(), "All Respondents 18+ US".toLowerCase(), `User is not presented with the "Audience Details" page`);     
    })

    it(`Select new value for Audience`, async function (){
        await audienceDetailsPage.selectYourAudienceByValue("Household Income $0-$25,000");
        await audienceDetailsPage.clickSaveAndFinishButton();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton()
    })

    it(`Scrape hieararchy for values`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
    })

    it(`Click filters drop down and select "Edit" Primary Brand element`,async function (){
        await brandPositioningPage.clickFiltersButton();
        await brandPositioningPage.clickEditBrandsButton();   
    })

    it(`Select a new "Primary Brand"`, async function (){
        await brandSelectorPage.removeAllFromCompetitiveSet();
        await brandSelectorPage.removePrimaryBrand();
        await brandSelectorPage.addSpecificBrand("JetBlue");
        await brandSelectorPage.clickSaveButton();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton();
    })

    it(`Scrape hieararchy for values for new brand`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        newBrandHierarchy = await brandPositioningPage.generatePillarsObj();
    })

    it(`Verify that values have loaded for the new brand`, async function (){
        let brandName = await brandPositioningPage.getPrimaryBrandBeingUsed();
        assert.equal(brandName.toLowerCase(), "JetBlue".toLowerCase(), "Incorrect brand name being displayed");
        assert.notEqual(newBrandHierarchy, hierarchyObj, "Values for hierarchy are the same, but should be different")
    })

})