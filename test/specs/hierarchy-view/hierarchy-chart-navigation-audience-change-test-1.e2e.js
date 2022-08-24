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

let sampleSizeBefore, sampleSizeAfter;

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

    it(`Enable sample size`, async function (){
        await brandPositioningPage.toggleSampleSize();
        sampleSizeBefore = await brandPositioningPage.getSampleSize()
        console.log('before sample size =>', sampleSizeBefore);
        
    })

    it(`Click filters drop down and select "Edit" Primary Audience element`,async function (){
        await brandPositioningPage.clickFiltersButton();
        await brandPositioningPage.clickEditPrimaryAudienceButton();
       
    })

    it(`Verify that you are presented with the "Audience Details Page"`, async function(){
        assert.equal((await audienceDetailsPage.getSelectedAudience()).toLowerCase(), "All Respondents 18+ US".toLowerCase(), `User is not presented with the "Audience Details" page`);
        
    })

    it(`Select new value for Audience`, async function (){
        await audienceDetailsPage.selectYourAudienceByValue("Household Income $0-$25,000");
        await audienceDetailsPage.clickSaveAndFinishButton();
    })

    it(`Verify that the new audience has loaded`, async function(){
        sampleSizeAfter = await brandPositioningPage.getSampleSize();
        assert.notEqual(sampleSizeAfter, sampleSizeBefore, "New audience had failed to load");
    })

    it(`Set audience back to default`, async function (){
        
        await brandPositioningPage.clickEditPrimaryAudienceButton();
        await audienceDetailsPage.selectYourAudienceByValue("All respondents 18+ US");
        await audienceDetailsPage.clickSaveAndFinishButton();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton();
    })

    it(`Verify that the audience is back to it's default value`, async function (){
        let assumedDefaultAudienceSize = await brandPositioningPage.getSampleSize();
        assert.equal(assumedDefaultAudienceSize, sampleSizeBefore, "Audience was not reset back to default");
    })
   
})