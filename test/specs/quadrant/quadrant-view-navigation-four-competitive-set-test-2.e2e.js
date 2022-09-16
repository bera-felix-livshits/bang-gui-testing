const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let activeButtons;

describe(`Quadrant View Navigation - Test 2 - Four Competitive Set`, () => {

    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select only 3 brands from the Competitive Set and click "Next" button`, async function () {
        await brandSelectorPage.addSpecificBrand("OshKosh");
        await brandSelectorPage.addSpecificBrand("Rustler");
        await brandSelectorPage.addSpecificBrand("Lee");
        await brandSelectorPage.addSpecificBrand("London Fog");
        // await brandSelectorPage.addSpecificBrand("Perry Ellis");
        await brandSelectorPage.clickNextButton();
    })

    it(`Audience Details - click the "Save & Finish" button`, async function () {
        await audienceDetailsPage.clickSaveAndFinishButton();
    })

    it(`Confirm that home page is displayed`, async function () {
        let brandEquitySummaryTable = await overviewPage.getNumericSummaryValues();
        assert.notEqual(brandEquitySummaryTable["Brand Equity"]["BERA Score"], '');
    })

    it(`Navigate to Brand Positions Stage`, async function () {
        await navBar.clickBrandPositioning();
        let isBrandPositioningDisplayed = await brandPositioningPage.isBrandPositioningHeaderDisplayed()
        assert.equal(isBrandPositioningDisplayed, true)
    })

    it(`Click the "Quadrant View" button in the view controller`, async function () {
        await brandPositioningPage.clickQuadrantViewButton()
    })

    it(`Verify that the Quadrant View is loaded`, async function () {
        let title = await brandPositioningPage.getSubscreenTitle();
        assert.equal(title.trim(), "DNA", "Title is not 'DNA' but should be")
    })

    it(`Verify that the Quadrant View does not load with 3 competitive brands`, async function(){
        let points = await brandPositioningPage.getAllQuadrantPoints();
        assert.equal(points.length, 0, "Quadrant should not have loaded, but it did.")
    })

    it(`Verify that you receive a banner is displayed at the top of the view, with the text “At least 4 brands are required in competitive set. Please add additional brands." with 3 competitive brands`, async function(){
        let errorBanner = await brandPositioningPage.getErrorBannerContents()
        console.log("error message => ", errorBanner.errorMessage.trim())
        assert.equal(errorBanner.errorMessage.trim(), "At least 4 brands are required in competitive set. Please add additional brands.", "Error message displayed in the banner does not match the expected 'At least 4 brands are required in competitive set. Please add additional brands.'")
    })

    it(`Verify that the notification banner has a link that allows customers to open the filter panel, where they can make edits to their Competitive Set with 3 competitive brands`, async function (){
        let errorBanner = await brandPositioningPage.getErrorBannerContents()
        await errorBanner.errorFiltersLink.click();
        
        let selectedBrands = await brandPositioningPage.getSelectedBrands()
        console.log("selectedBrands =>", JSON.stringify(selectedBrands, null, 4))
        assert.equal(!!selectedBrands.primaryBrand, true, "Notification banner link failed to open the filter panel")
    })

    it(`Change competitive set to have 2 brands`, async function () {
        await brandPositioningPage.clickEditBrandsButton();
        await brandSelectorPage.removeAllFromCompetitiveSet();

        await brandSelectorPage.addSpecificBrand("Rustler");
        await brandSelectorPage.addSpecificBrand("Lee");

        await brandSelectorPage.clickSaveButton();
        await brandPositioningPage.clickCloseFiltersButton();
    })

    it(`Verify that the Quadrant View does not load with 2 competitive brands`, async function(){
        let points = await brandPositioningPage.getAllQuadrantPoints();
        assert.equal(points.length, 0, "Quadrant should not have loaded, but it did.")
    })

    it(`Verify that you receive a banner is displayed at the top of the view, with the text “At least 4 brands are required in competitive set. Please add additional brands." with 2 competitive brands`, async function(){
        let errorBanner = await brandPositioningPage.getErrorBannerContents()
        console.log("error message => ", errorBanner.errorMessage.trim())
        assert.equal(errorBanner.errorMessage.trim(), "At least 4 brands are required in competitive set. Please add additional brands.", "Error message displayed in the banner does not match the expected 'At least 4 brands are required in competitive set. Please add additional brands.'")
    })

    it(`Verify that the notification banner has a link that allows customers to open the filter panel, where they can make edits to their Competitive Set with 2 competitive brands`, async function (){
        let errorBanner = await brandPositioningPage.getErrorBannerContents()
        await errorBanner.errorFiltersLink.click();
        
        let selectedBrands = await brandPositioningPage.getSelectedBrands()
        console.log("selectedBrands =>", JSON.stringify(selectedBrands, null, 4))
        assert.equal(!!selectedBrands.primaryBrand, true, "Notification banner link failed to open the filter panel")
    })

    it(`Change competitive set to have 1 brands`, async function () {
        await brandPositioningPage.clickEditBrandsButton();
        await brandSelectorPage.removeAllFromCompetitiveSet();

        await brandSelectorPage.addSpecificBrand("Rustler");

        await brandSelectorPage.clickSaveButton();
        await brandPositioningPage.clickCloseFiltersButton();
        // await new Promise(res => setTimeout(() => { res() }, 10000))
    })

    it(`Verify that the Quadrant View does not load with 1 competitive brands`, async function(){
        let points = await brandPositioningPage.getAllQuadrantPoints();
        assert.equal(points.length, 0, "Quadrant should not have loaded, but it did.")
    })

    it(`Verify that you receive a banner is displayed at the top of the view, with the text “At least 4 brands are required in competitive set. Please add additional brands." with 1 competitive brands`, async function(){
        let errorBanner = await brandPositioningPage.getErrorBannerContents()
        console.log("error message => ", errorBanner.errorMessage.trim())
        assert.equal(errorBanner.errorMessage.trim(), "At least 4 brands are required in competitive set. Please add additional brands.", "Error message displayed in the banner does not match the expected 'At least 4 brands are required in competitive set. Please add additional brands.'")
    })

    it(`Verify that the notification banner has a link that allows customers to open the filter panel, where they can make edits to their Competitive Set with 1 competitive brands`, async function (){
        let errorBanner = await brandPositioningPage.getErrorBannerContents()
        await errorBanner.errorFiltersLink.click();
        
        let selectedBrands = await brandPositioningPage.getSelectedBrands()
        console.log("selectedBrands =>", JSON.stringify(selectedBrands, null, 4))
        assert.equal(!!selectedBrands.primaryBrand, true, "Notification banner link failed to open the filter panel")
    })

    it(`Change competitive set to have 4 brands`, async function () {
        await brandPositioningPage.clickEditBrandsButton();
        await brandSelectorPage.removeAllFromCompetitiveSet();

        await brandSelectorPage.addSpecificBrand("Rustler");
        await brandSelectorPage.addSpecificBrand("Lee");
        await brandSelectorPage.addSpecificBrand("London Fog");
        await brandSelectorPage.addSpecificBrand("Perry Ellis");

        await brandSelectorPage.clickSaveButton();
        await brandPositioningPage.clickCloseFiltersButton();
        // await new Promise(res => setTimeout(() => { res() }, 10000))
    })

    it(`Verify that the Quadrant View does load with 4 competitive brands`, async function(){
        let points = await brandPositioningPage.getAllQuadrantPoints();
        assert.equal(points.length > 0, true, "Quadrant should not have loaded, but it did.")
    })

    it(`Verify that you do not receive a banner with 4 competitive brands`, async function(){
        let errorBanner = await brandPositioningPage.getErrorBannerContents()
        console.log("error message 4 => ", errorBanner.errorMessage.trim())
        assert.equal(errorBanner.errorMessage.trim(), "", "Error message is displayed when 4 or more brands exist in competitive set")
    })

    it(`Change competitive set to have 5 brands`, async function () {
        await brandPositioningPage.clickFiltersButton();
        await brandPositioningPage.clickEditBrandsButton();

        await brandSelectorPage.removeAllFromCompetitiveSet();
        
        await brandSelectorPage.addSpecificBrand("Champion Sportswear");
        await brandSelectorPage.addSpecificBrand("Coach (fashion)");
        await brandSelectorPage.addSpecificBrand("Dockers");
        await brandSelectorPage.addSpecificBrand("GUESS");
        await brandSelectorPage.addSpecificBrand("The North Face")
        await brandSelectorPage.clickSaveButton();
        await brandPositioningPage.clickCloseFiltersButton();

    })

    it(`Verify that the Quadrant View does load with 5 competitive brands`, async function(){
        let points = await brandPositioningPage.getAllQuadrantPoints();
        assert.equal(points.length > 0, true, "Quadrant should not have loaded, but it did.")
    })

    it(`Verify that you do not receive a banner with 5 competitive brands`, async function(){
        let errorBanner = await brandPositioningPage.getErrorBannerContents()
        console.log("error message 5 => ", errorBanner.errorMessage.trim())
        assert.equal(errorBanner.errorMessage.trim(), "", "Error message is displayed when 4 or more brands exist in competitive set")
    })

})