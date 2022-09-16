const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const analysisPeriodSelectorAndFilters = require('../../page-objects/common-components/analysis-period-selector-and-filters.js');

describe(`Quadrant View Navigation - Hover Over - Test 1`, () => {

    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select the first 5 brands from the list available and click "Next" button`, async function () {
        await brandSelectorPage.selectFirstNBrands(5);
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
        assert.equal(quadContent.length, 4, "Quadrant content did load, but expecting that it should not.")
    })

    it(`Verify that a brief description of the hovered quadrant shows above the quadrant - Bottom Right`, async function(){
        let el = await brandPositioningPage.getQuadrant('bottom-right');
        await el.click()
        let desc = await brandPositioningPage.getActiveQuadrantDescription()
        assert.equal(desc, "Attributes in which this brand is a category follower", "Description in bottom-right of quadrant chart is not matching expected value.");
    })

    it(`Verify that the area description to the left of the quadrant chart updates to show a description about the hovered quadrant - Bottom Right`, async function(){
        let el = await brandPositioningPage.getQuadrant('bottom-right');
        await el.click()
        let desc = await brandPositioningPage.getQuadrantAreaDescription()
        console.log('desc =>', desc)
        assert.equal(desc, "Attributes in which this brand is a category follower", "Left Side Quadrant Area Description of selected quadrant (bottom-right) chart is not matching expected value.");
    })

    it(`Verify that a zoom indicator icon appears in the upper-right of the quadrant - Bottom Right`, async function (){
        let el = await brandPositioningPage.getQuadrant('bottom-right');
        await el.click()
        let expander = (await brandPositioningPage.getQuadrantExpander('bottom-right')).el;
        assert.equal(await expander.isDisplayed(), true, "Bottom Right Expander is not Visible")
    })


    it(`Verify that clicking on it allows the user to zoom into this quadrant - Bottom Right`, async function (){
        let el = await brandPositioningPage.getQuadrant('bottom-right');
        await el.click()
        let expander = (await brandPositioningPage.getQuadrantExpander('bottom-right')).el;
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
        assert.notDeepEqual(vertDeviderLocationOne, vertDeviderLocationtwo, "Clicking on the exander does not cause zoom - Bottom Right")
    })

})
