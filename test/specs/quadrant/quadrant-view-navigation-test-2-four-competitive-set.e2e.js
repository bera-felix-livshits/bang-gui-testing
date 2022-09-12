const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const analysisPeriodSelectorAndFilters = require('../../page-objects/common-components/analysis-period-selector-and-filters.js');

describe(`Quadrant View Navigation - Test 2 - Four Competitive Set`, () => {

    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select the first 4 brands from the list available and click "Next" button`, async function () {
        await brandSelectorPage.selectFirstNBrands(4);
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
        await brandPositioningPage.clickQuadrantViewButton();
    })

    it(`Verify that the Quadrant View contents do not load`, async function () {
        let quadContent = await brandPositioningPage.scrapeForQuadrentContent();
        console.log("quadContent => ", JSON.stringify(quadContent, null, 4))
        assert.equal(quadContent.length, 0, "Quadrant content did load, but expecting that it should not.")
    })

    it(`Confirm error message is displayed when only 3`, async function () {
        let expectedError = await brandPositioningPage.getErrorBannerContents()
        assert.equal(expectedError.errorIconDisplayed, true, "Expected to see an error icon in the error banner.")
        assert.equal(expectedError.errorMessage, "At least 4 brands are required in competitive set. Please add additional brands.", "Error message does not match the expected `At least 4 brands are required in competitive cet. At least 4 brands are required in competitive set. Please add additional brands.`.")
    })

    it(`Select only 2 brands from the Competitive Set`, async function () {
        await brandPositioningPage.clickFiltersButton();
        await analysisPeriodSelectorAndFilters.clickEditBrandsButton();
        await brandSelectorPage.removeAllFromCompetitiveSet();

        await brandSelectorPage.addSpecificBrand("Contigo")
        await brandSelectorPage.addSpecificBrand("Corkcicle")
        
        await brandSelectorPage.clickSaveButton();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton()
    })

    it(`Confirm error message is displayed when only 2`, async function () {
        let expectedError = await brandPositioningPage.getErrorBannerContents()
        assert.equal(expectedError.errorIconDisplayed, true, "Expected to see an error icon in the error banner.")
        assert.equal(expectedError.errorMessage, "At least 4 brands are required in competitive set. Please add additional brands.", "Error message does not match the expected `At least 4 brands are required in competitive set. Please add additional brands.`.")
    })

    it(`Select only 1 brands from the Competitive Set`, async function () {
        await brandPositioningPage.clickFiltersButton();
        await analysisPeriodSelectorAndFilters.clickEditBrandsButton();
        await brandSelectorPage.removeAllFromCompetitiveSet();
        await brandSelectorPage.addSpecificBrand("Hydro Flask")
        await brandSelectorPage.clickSaveButton();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton()
    })

    it(`Confirm error message is displayed when only 1`, async function () {
        let expectedError = await brandPositioningPage.getErrorBannerContents()
        assert.equal(expectedError.errorIconDisplayed, true, "Expected to see an error icon in the error banner.")
        assert.equal(expectedError.errorMessage, "At least 4 brands are required in competitive set. Please add additional brands.", "Error message does not match the expected `At least 4 brands are required in competitive set. Please add additional brands.`.")
    })

    it(`Select 4 brands from the Competitive Set`, async function () {
        await brandPositioningPage.clickFiltersButton();
        await analysisPeriodSelectorAndFilters.clickEditBrandsButton();
        await brandSelectorPage.removeAllFromCompetitiveSet();

        await brandSelectorPage.addSpecificBrand("Contigo")
        await brandSelectorPage.addSpecificBrand("Corkcicle")
        await brandSelectorPage.addSpecificBrand("Hydro Flask")
        await brandSelectorPage.addSpecificBrand("Igloo (coolers)")

        await brandSelectorPage.clickSaveButton();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton()
    })

    it(`Verify that the Quadrant View contents load when 4 competitive brands are selected`, async function () {
        let quadContent = await brandPositioningPage.scrapeForQuadrentContent();
        console.log("quadContent => ", JSON.stringify(quadContent, null, 4))
        assert.equal(quadContent.length, 4, "Quadrant content did not load, but expecting that it should.")
    })

    it(`Select 5 brands from the Competitive Set`, async function () {
        await brandPositioningPage.clickFiltersButton();
        await analysisPeriodSelectorAndFilters.clickEditBrandsButton();
        await brandSelectorPage.removeAllFromCompetitiveSet();
        await brandSelectorPage.selectFirstNBrands(5);
        await brandSelectorPage.clickSaveButton();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton()
    })

    it(`Verify that the Quadrant View contents load when 5 competitive brands are selected`, async function () {
        let quadContent = await brandPositioningPage.scrapeForQuadrentContent();
        console.log("quadContent => ", JSON.stringify(quadContent, null, 4))
        assert.equal(quadContent.length, 4, "Quadrant content did not load, but expecting that it should.")
    })

})

        // At least 4 brands are required in competitive cet. At least 4 brands are required in competitive set. Please add additional brands.
        // await new Promise(res => {
        //     setTimeout(() => {
        //         res();
        //     }, 15000)
        // })