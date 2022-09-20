const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let activeButtons;

describe(`Quadrant View Navigation - Zoom - Test 4`, () => {

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
        let baseQuadVisible = await (await brandPositioningPage.getQuadrant('top-left')).isDisplayed();
        let topRightVisible = await (await brandPositioningPage.getQuadrant('top-right')).isDisplayed();
        let bottomLeftVisible = await (await brandPositioningPage.getQuadrant('bottom-left')).isDisplayed();
        let bottomRightVisible = await (await brandPositioningPage.getQuadrant('bottom-right')).isDisplayed();

        assert.equal(baseQuadVisible && topRightVisible && bottomLeftVisible && bottomRightVisible, true, "All quadrants are not visible");
    })

    it(`Icon should be an arrow before it is expanded (bottom-right)`, async function () {
        let quad = await brandPositioningPage.getQuadrant(`bottom-right`);
        await quad.moveTo();
        let baseQuad = await brandPositioningPage.getQuadrantExpander('bottom-right');

        assert.equal(baseQuad.icon, "expand", "Icon should be an expanding arrow, but is not")
    })

    it(`Verify that the Quadrant zooms in and fills the space (bottom-right)`, async function () {
        let baseQuad = await brandPositioningPage.getQuadrantExpander('bottom-right');
        await baseQuad.el.click();

        let quadPercentages = await brandPositioningPage.getQuadrantPercentageOfQuadrant('bottom-right')

        assert.equal(quadPercentages.widthPercentage > 0.5 && quadPercentages.heightPercentage > 0.5, true, "Bottom Right quadrant should have been expanded after expand icon is clicked")
    })

    it(`Icon should be an "X" after it is expanded (bottom-right)`, async function () {
        // let quad = await brandPositioningPage.getQuadrant(`top-left`);
        // await quad.moveTo();
        let baseQuad = await brandPositioningPage.getQuadrantExpander('bottom-right');
        // await baseQuad.el.click();
        assert.equal(baseQuad.icon, "collapse", "Icon should be an expanding arrow, but is not")
    })

    it(`Verify that the view pans to that new quadrant when the Top Right quadrant is clicked (bottom-right to top-left)`, async function (){
        let quad = await brandPositioningPage.getQuadrant(`top-left`);
        await quad.moveTo();
        let topLeft = await brandPositioningPage.getQuadrantExpander('top-left');
        await topLeft.el.click();
        let quadPercentages = await brandPositioningPage.getQuadrantPercentageOfQuadrant('top-left');
        let baseQuad = await brandPositioningPage.getQuadrantExpander('bottom-right');
        await baseQuad.el.click()

        // await new Promise(res => setTimeout(()=> res(), 5000));

        assert.equal(quadPercentages.widthPercentage > 0.5 && quadPercentages.heightPercentage > 0.5, true, "Top Left quadrant should have been expanded after expand icon is clicked")
    })

    it(`Verify that the view pans to that new quadrant when the Top Right quadrant is clicked (bottom-right to top-right)`, async function (){
        let quad = await brandPositioningPage.getQuadrant(`top-right`);
        await quad.moveTo();
        let bottomLeft = await brandPositioningPage.getQuadrantExpander('top-right');
        await bottomLeft.el.click();
        let quadPercentages = await brandPositioningPage.getQuadrantPercentageOfQuadrant('top-right');
        let baseQuad = await brandPositioningPage.getQuadrantExpander('bottom-right');
        await baseQuad.el.click()

        // await new Promise(res => setTimeout(()=> res(), 5000));

        assert.equal(quadPercentages.widthPercentage > 0.5 && quadPercentages.heightPercentage > 0.5, true, "Top Right quadrant should have been expanded after expand icon is clicked")
    })

    it(`Verify that the view pans to that new quadrant when the Top Right quadrant is clicked (bottom-right to bottom-left)`, async function (){
        let quad = await brandPositioningPage.getQuadrant(`bottom-left`);
        await quad.moveTo();
        let bottomRight = await brandPositioningPage.getQuadrantExpander('bottom-left');
        await bottomRight.el.click();
        let quadPercentages = await brandPositioningPage.getQuadrantPercentageOfQuadrant('bottom-left');
        let baseQuad = await brandPositioningPage.getQuadrantExpander('bottom-right');
        await baseQuad.el.click()
//bottom-right
        // await new Promise(res => setTimeout(()=> res(), 5000));

        assert.equal(quadPercentages.widthPercentage > 0.5 && quadPercentages.heightPercentage > 0.5, true, "Bottom Left quadrant should have been expanded after expand icon is clicked")
    })

    it(`Verify that the view is zoomed back out to the normal 2x2 Quadrant View (bottom-right)`, async function (){
        let baseQuad = await brandPositioningPage.getQuadrantExpander('bottom-right');
        await baseQuad.el.click()

        // await new Promise(res => setTimeout(()=> res(), 5000));
        let quadPercentages = await brandPositioningPage.getQuadrantPercentageOfQuadrant('bottom-right');
        console.log("quadPercentages =>", quadPercentages)
        assert.equal(quadPercentages.widthPercentage === 0.5 && quadPercentages.heightPercentage === 0.5, true, "Collapsing the quadrant by clicking the expander again has failed to resize to normal 2x2 Quadrant View")
    })


})