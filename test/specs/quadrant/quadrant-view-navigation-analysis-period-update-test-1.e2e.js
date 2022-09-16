const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let pointsPurposeBefore, pointsEmotionalBefore, pointsPurposeAfter, pointsEmotionalAfter;

describe(`Quadrant View Navigation - Test 1 - Analysis Period Update`, () => {

    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select 5 brands from the list available and click "Next" button`, async function () {
        await brandSelectorPage.addSpecificBrand("OshKosh");
        await brandSelectorPage.addSpecificBrand("Rustler");
        await brandSelectorPage.addSpecificBrand("Lee");
        await brandSelectorPage.addSpecificBrand("London Fog");
        await brandSelectorPage.addSpecificBrand("Perry Ellis");
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

    it(`Verify that the view title is set to “2x2 Quadrant View`, async function () {
        let topLeftVisible = await (await brandPositioningPage.getQuadrant('top-left')).isDisplayed();
        let topRightVisible = await (await brandPositioningPage.getQuadrant('top-right')).isDisplayed();
        let bottomLeftVisible = await (await brandPositioningPage.getQuadrant('bottom-left')).isDisplayed();
        let bottomRightVisible = await (await brandPositioningPage.getQuadrant('bottom-right')).isDisplayed();

        assert.equal(topLeftVisible && topRightVisible && bottomLeftVisible && bottomRightVisible, true, "All quadrants are not visible");
    })

    it(`Capture points on quadrant BEFORE date change`, async function(){
        pointsPurposeBefore = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickEmotionalButton();

        pointsEmotionalBefore = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickPurposeButton();
    })

    it(`Change the Analysis Period to a different year`, async function () {
        await brandPositioningPage.clickAnalysisPeriodDropDown();
        await brandPositioningPage.setIntervalOrAnalysisPeriodInDropdown("Last 2 Years");
        newTimePeriod = await brandPositioningPage.getDisplayedAnalysisPeriodText();
        console.log('new time period =>', newTimePeriod)
    })

    it(`Capture points on quadrant AFTER date change`, async function(){
        pointsPurposeAfter = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickEmotionalButton();

        pointsEmotionalAfter = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickPurposeButton();
    })

    it(`Verify that points on the quadrant are different after analysis period change`, async function(){
        assert.notDeepEqual(pointsPurposeBefore, pointsPurposeAfter, `Expecting points on quadrant for "Purpose" to be different after period analysis change, but was the same.`)
        assert.notDeepEqual(pointsEmotionalBefore, pointsEmotionalAfter, `Expecting points on quadrant for "Emotional" to be different after period analysis change, but was the same.`)
    })
})