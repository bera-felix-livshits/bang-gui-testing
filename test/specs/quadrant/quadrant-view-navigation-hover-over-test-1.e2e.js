const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

describe(`Quadrant View Navigation - Hover Over - Test 1`, () => {

    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Select the "US Brandscape" dataset.`, async function () {
        await filtersSideBar.selectDataSet("US Brandscape");
    })

    it(`Select 5 brands from the list available`, async function () {
        await filtersSideBar.addPrimaryBrand("OshKosh");
        await filtersSideBar.addCompetitiveSetBrands([
            "Rustler",
            "Lee",
            "London Fog",
            "Perry Ellis"
        ])

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
        assert.equal(quadContent.length, 4, "Quadrant content did load, but expecting that it should not.")
    })

    it(`Verify that a brief description of the hovered quadrant shows above the quadrant - Top Left`, async function () {
        let el = await brandPositioningPage.getQuadrant('top-left');
        await el.click()
        let desc = await brandPositioningPage.getActiveQuadrantDescription()
        assert.equal(desc, "Latent connection between a brand and it's attributes", "Description in top-left of quadrant chart is not matching expected value.");
    })

    it(`Verify that the area description to the left of the quadrant chart updates to show a description about the hovered quadrant - Top Left`, async function () {
        let el = await brandPositioningPage.getQuadrant('top-left');
        await el.click()
        let desc = await brandPositioningPage.getQuadrantAreaDescription()
        assert.equal(desc, "Latent connection between a brand and it's attributes", "Left Side Quadrant Area Description of selected quadrant (top-left) chart is not matching expected value.");
    })

    it(`Verify that a zoom indicator icon appears in the upper-right of the quadrant - Top Left`, async function () {
        let el = await brandPositioningPage.getQuadrant('top-left');
        await el.click()
        let expander = (await brandPositioningPage.getQuadrantExpander('top-left')).el;
        assert.equal(await expander.isDisplayed(), true, "Top Left Expander is not Visible")
    })

    it(`Verify that clicking on it allows the user to zoom into this quadrant - Top Left`, async function () {
        let el = await brandPositioningPage.getQuadrant('top-left');
        await el.click()
        let expander = (await brandPositioningPage.getQuadrantExpander('top-left')).el;
        let vertDeviderLocationOne = await (await brandPositioningPage.getVerticalDivider()).getLocation();
        console.log("vertDeviderLocationOne =>", vertDeviderLocationOne)
        await expander.click();

        // Adding a 1 second delay to allow vertical divider to move
        await new Promise(res => setTimeout(() => {
            res();
        }, 1000))

        let vertDeviderLocationtwo = await (await brandPositioningPage.getVerticalDivider()).getLocation();
        console.log("vertDeviderLocationtwo =>", vertDeviderLocationtwo)

        await expander.click();
        assert.notDeepEqual(vertDeviderLocationOne, vertDeviderLocationtwo, "Clicking on the exander does not cause zoom - Top Left")
    })

})

        // At least 4 brands are required in competitive cet. Please add additional brands.
        // await new Promise(res => {
        //     setTimeout(() => {
        //         res();
        //     }, 15000)
        // })