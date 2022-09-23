const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

describe(`Quadrant View Navigation - Test 2 - Four Competitive Set`, () => {

    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Select the "US Brandscape" dataset.`, async function () {
        await filtersSideBar.selectDataSet("US Brandscape");
    })

    it(`Select a primary brand and 3 brands from the list available and click "Next" button`, async function () {
        await filtersSideBar.addPrimaryBrand("OshKosh");

        await filtersSideBar.addCompetitiveSetBrands([
            "Rustler",
            "Lee",
            "London Fog",
        ])        
    })

    it(`Click close filters button`, async function (){
        await filtersSideBar.clickCloseFiltersButton();
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
        await filtersSideBar.clickFiltersButton();
        
        await filtersSideBar.removeAllFromCompetitiveSet();
        await filtersSideBar.addCompetitiveSetBrands([
            "Contigo",
            "Corkcicle"
        ])   

        await filtersSideBar.clickCloseFiltersButton()
    })

    it(`Confirm error message is displayed when only 2`, async function () {
        let expectedError = await brandPositioningPage.getErrorBannerContents()
        assert.equal(expectedError.errorIconDisplayed, true, "Expected to see an error icon in the error banner.")
        assert.equal(expectedError.errorMessage, "At least 4 brands are required in competitive set. Please add additional brands.", "Error message does not match the expected `At least 4 brands are required in competitive set. Please add additional brands.`.")
    })


    it(`Select only 1 brands from the Competitive Set`, async function () {
        await filtersSideBar.clickFiltersButton();
        
        await filtersSideBar.removeAllFromCompetitiveSet();
        await filtersSideBar.addCompetitiveSetBrands([
            "Hydro Flask"
        ])   

        await filtersSideBar.clickCloseFiltersButton()
       
    })

    it(`Confirm error message is displayed when only 1`, async function () {
        let expectedError = await brandPositioningPage.getErrorBannerContents()
        assert.equal(expectedError.errorIconDisplayed, true, "Expected to see an error icon in the error banner.")
        assert.equal(expectedError.errorMessage, "At least 4 brands are required in competitive set. Please add additional brands.", "Error message does not match the expected `At least 4 brands are required in competitive set. Please add additional brands.`.")
    })

    it(`Select 4 brands from the Competitive Set`, async function () {
        await filtersSideBar.clickFiltersButton();
        
        await filtersSideBar.removeAllFromCompetitiveSet();
        await filtersSideBar.addCompetitiveSetBrands([
            "Contigo",
            "Corkcicle",
            "Hydro Flask",
            "Igloo (coolers)"
        ])   
    })

    it(`Close filters sidebar`, async function (){
        await filtersSideBar.clickCloseFiltersButton()
    })

    it(`Verify that the Quadrant View contents load when 4 competitive brands are selected`, async function () {
        let quadContent = await brandPositioningPage.scrapeForQuadrentContent();
        console.log("quadContent => ", JSON.stringify(quadContent, null, 4))
        assert.equal(quadContent.length, 4, "Quadrant content did not load, but expecting that it should.")
    })

    it(`Select 5 brands from the Competitive Set`, async function () {
        await filtersSideBar.clickFiltersButton();
        
        await filtersSideBar.removeAllFromCompetitiveSet();
        await filtersSideBar.addCompetitiveSetBrands([
            "Contigo",
            "Corkcicle",
            "Hydro Flask",
            "Igloo (coolers)",
            "Adidas"
        ])   
    })

    it(`Close filters sidebar`, async function (){
        await filtersSideBar.clickCloseFiltersButton()
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