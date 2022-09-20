const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let activeButtons;

describe(`Quadrant View Navigation - Test 1 - Toggle Between Constructs`, () => {

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

    it(`Capture brand name from logo and confirm that they are clickable`, async function () {
        activeButtons = await brandPositioningPage.getActiveButtons();
    })

    it(`Verify that there exists options at the top of the Quadrant that allows for clicking on the Emotional and Purpose Tabs`, async function () {
        let emotionalButton = activeButtons.find(el => el.buttonText.toLowerCase() === "emotional");
        let purposelButton = activeButtons.find(el => el.buttonText.toLowerCase() === "purpose");

        assert.equal(await emotionalButton.buttonElement.isClickable(), true, "Emotional construct button is not clickable");
        assert.equal(await purposelButton.buttonElement.isClickable(), true, "Purpose construct button is not clickable");
    })

    it(`Verify that no other options/tabs appear`, async function () {
        let emotionalButton = activeButtons.find(el => el.buttonText.toLowerCase() === "emotional");
        let purposelButton = activeButtons.find(el => el.buttonText.toLowerCase() === "purpose");

        assert.equal(!!emotionalButton, true, "Emotional button is not present");
        assert.equal(!!purposelButton, true, "Purpose button is not present");
        assert.equal(activeButtons.length, 2, "There exist other options beyond Emotional and Purpose")
    })

    it(`Verify that the visual updates to show the factor/attributes for the Purpose construct`, async function (){
        await brandPositioningPage.clickPurposeButton();
        let topLeft = await brandPositioningPage.getQuadrantUpdateComponents('top-left');
        let bottomLeft = await brandPositioningPage.getQuadrantUpdateComponents('bottom-left');
        let topRight = await brandPositioningPage.getQuadrantUpdateComponents('top-right');
        let bottomRight = await brandPositioningPage.getQuadrantUpdateComponents('top-left');
        console.log('purpose to-left =>', JSON.stringify(topLeft, null, 4));
        assert.equal(topLeft.colour.value, "rgb(255,220,122)", "Colour should be Apricot but is not");
        assert.equal(bottomLeft.colour.value, "rgb(255,220,122)", "Colour should be Apricot but is not");
        assert.equal(topRight.colour.value, "rgb(255,220,122)", "Colour should be Apricot but is not");
        assert.equal(bottomRight.colour.value, "rgb(255,220,122)", "Colour should be Apricot but is not");
    })

    it(`Verify that the visual updates to show the factor/attributes for the Purpose background`, async function (){
        
        await brandPositioningPage.clickPurposeButton();
        let colourFactor = await brandPositioningPage.getQuadrantsChartBackgroundColor();

        await brandPositioningPage.toggleFactorsAndAttributes();
        let colourAttributes = await brandPositioningPage.getQuadrantsChartBackgroundColor();

        await brandPositioningPage.toggleFactorsAndAttributes();

        assert.equal(colourFactor, "rgb(255,220,122)", "Colour should be Apricot but is not");
        assert.equal(colourAttributes, "rgb(255,220,122)", "Colour should be Apricot but is not");
    })

    it(`Verify that the visual updates to show the factor/attributes for the Emotional construct`, async function (){
        await brandPositioningPage.clickEmotionalButton();
        let topLeft = await brandPositioningPage.getQuadrantUpdateComponents('top-left');
        let bottomLeft = await brandPositioningPage.getQuadrantUpdateComponents('bottom-left');
        let topRight = await brandPositioningPage.getQuadrantUpdateComponents('top-right');
        let bottomRight = await brandPositioningPage.getQuadrantUpdateComponents('top-left');
        console.log('emotional to-left =>', JSON.stringify(topLeft, null, 4))
        assert.equal(topLeft.colour.value, "rgb(252,172,125)", "Colour should be Orange but is not");
        assert.equal(bottomLeft.colour.value, "rgb(252,172,125)", "Colour should be Orange but is not");
        assert.equal(topRight.colour.value, "rgb(252,172,125)", "Colour should be Orange but is not");
        assert.equal(bottomRight.colour.value, "rgb(252,172,125)", "Colour should be Orange but is not");
    })

    it(`Verify that the visual updates to show the factor/attributes for the Emotional background`, async function (){
        
        await brandPositioningPage.clickEmotionalButton();
        let colourFactor = await brandPositioningPage.getQuadrantsChartBackgroundColor();

        await brandPositioningPage.toggleFactorsAndAttributes();
        let colourAttributes = await brandPositioningPage.getQuadrantsChartBackgroundColor();

        await brandPositioningPage.toggleFactorsAndAttributes();

        console.log(`colourAttributes Emotional =>`, colourAttributes)

        assert.equal(colourFactor, "rgb(252,172,125)", "Colour should be Orange but is not");
        assert.equal(colourAttributes, "rgb(252,172,125)", "Colour should be Orange but is not");
    })

})