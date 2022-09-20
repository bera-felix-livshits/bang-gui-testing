const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let activeButtons;

describe(`Quadrant View Navigation - Test 3 - Default Load Params`, () => {

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

    it(`Verify that the Brand Positioning construct is set to “Purpose”`,async function (){
        let buttons = await brandPositioningPage.getActiveButtons()
        console.log(`buttons length =>`, buttons.length)
      
        let purposeButton = buttons.find(el => el.buttonText.toLowerCase() === "purpose");
        let emotionalButton = buttons.find(el => el.buttonText.toLowerCase() === "emotional");

        assert.equal(purposeButton.selected, true, "Purpose button is not active by default")
        assert.equal(emotionalButton.selected, false, "Emotional button is active by default")
    })

    it(`Verify that the Attribute toggle is set to Attribute`,async function (){
        let factorsAndAttributesToggle =await brandPositioningPage.getToggleFactorsAndAttributes()
        assert.equal(await factorsAndAttributesToggle.isSelected(), false, "Toggle should be set to Factors by default but is set to Attributes");
    })

    it(`Verify that the Drivers are turned off`, async function (){
        let driversToggle = await brandPositioningPage.getToggleDrivers();
        assert.equal(await driversToggle.isSelected(), false, "Drivers toggle should be set to off by default but is set to on");
    })

    it(`Verify that the visual is set to the 2x2 Quadrant (i.e., not the summary view)`, async function () {
        let topLeftVisible = await (await brandPositioningPage.getQuadrant('top-left')).isDisplayed();
        let topRightVisible = await (await brandPositioningPage.getQuadrant('top-right')).isDisplayed();
        let bottomLeftVisible = await (await brandPositioningPage.getQuadrant('bottom-left')).isDisplayed();
        let bottomRightVisible = await (await brandPositioningPage.getQuadrant('bottom-right')).isDisplayed();

        assert.equal(topLeftVisible && topRightVisible && bottomLeftVisible && bottomRightVisible, true, "All quadrants are not visible");
    })

   it(`Verify that the Purpose Attributes populate on the chart`, async function (){
        let allPoints = await brandPositioningPage.getAllQuadrantPoints()

        assert.equal(allPoints.some(el => el.text === "Social Impact"), true, "Purpose Attribute Social Impact is missing, but should be displayed by default")
        assert.equal(allPoints.some(el => el.text === "Universal Connection"), true, "Purpose Attribute Universal Connection is missing, but should be displayed by default")
        assert.equal(allPoints.some(el => el.text === "Consistent Focus"), true, "Purpose Attribute Consistent Focus is missing, but should be displayed by default")
        assert.equal(allPoints.some(el => el.text === "Protagonism"), true, "Purpose Attribute Protagonism is missing, but should be displayed by default")
   })

})