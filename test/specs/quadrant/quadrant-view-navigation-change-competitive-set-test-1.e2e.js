const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let pointsPurposeBeforeFactors, pointsEmotionalBeforeFactors, pointsPurposeAfterFactors, pointsEmotionalAfterFactors;
let pointsPurposeBeforeAttributes, pointsEmotionalBeforeAttributes, pointsPurposeAfterAttributes, pointsEmotionalAfterAttributes;

describe(`Quadrant View Navigation - Test 1 - Change Competitive Set`, () => {

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

    it(`Capture points on quadrant BEFORE date change for `, async function () {
        pointsPurposeBeforeFactors = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickEmotionalButton();

        pointsEmotionalBeforeFactors = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickPurposeButton();

        await brandPositioningPage.toggleFactorsAndAttributes();

        pointsPurposeBeforeAttributes = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickEmotionalButton();

        pointsEmotionalBeforeAttributes = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickPurposeButton();

        await brandPositioningPage.toggleFactorsAndAttributes();
    })

    it(`Navigate to Edit Brands onbaording modal"`, async function () {
        await brandPositioningPage.clickFiltersButton();
        await brandPositioningPage.clickEditBrandsButton();
    })

    it(`Verify that the brand onboarding modal is launched`, async function () {
        assert.equal(await brandSelectorPage.isOnboardingScreenDisplayed(), true, "Onboarding Brand Selector Modal is not displayed.");
    })

    it(`Change competitive set`, async function () {

        await brandSelectorPage.removeAllFromCompetitiveSet();
        // await brandSelectorPage.removePrimaryBrand();
        // await new Promise(res => setTimeout(() => { res() }, 10000))
        // await brandSelectorPage.addSpecificBrand("Calvin Klein");
        await brandSelectorPage.addSpecificBrand("Champion Sportswear");
        await brandSelectorPage.addSpecificBrand("Coach (fashion)");
        await brandSelectorPage.addSpecificBrand("Dockers");
        await brandSelectorPage.addSpecificBrand("GUESS");
    })

    it(`Save changes to competitive set`, async function (){
        await brandSelectorPage.clickSaveButton();
    })

    it(`Exit the brand onboarding screen`, async function (){
        await brandPositioningPage.clickCloseFiltersButton();
    })

    it(`Capture points on quadrant AFTER brand change`, async function () {
        pointsPurposeAfterFactors = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickEmotionalButton();

        pointsEmotionalAfterFactors = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickPurposeButton();

        await brandPositioningPage.toggleFactorsAndAttributes();

        pointsPurposeAfterAttributes = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickEmotionalButton();

        pointsEmotionalAfterAttributes = await brandPositioningPage.getAllQuadrantPoints();
        await brandPositioningPage.clickPurposeButton();

        await brandPositioningPage.toggleFactorsAndAttributes();
    })

    it(`Verify that points on the quadrant are different after analysis period change`, async function () {
        assert.notDeepEqual(pointsPurposeBeforeFactors, pointsPurposeAfterFactors, `Expecting points on quadrant for "Purpose" Factors to be different after period analysis change, but was the same.`)
        assert.notDeepEqual(pointsEmotionalBeforeFactors, pointsEmotionalAfterFactors, `Expecting points on quadrant for "Emotional" Factors to be different after period analysis change, but was the same.`)

        assert.notDeepEqual(pointsPurposeBeforeAttributes, pointsPurposeAfterAttributes, `Expecting points on quadrant for "Purpose" Attributes to be different after period analysis change, but was the same.`)
        assert.notDeepEqual(pointsEmotionalBeforeAttributes, pointsEmotionalAfterAttributes, `Expecting points on quadrant for "Emotional" Attributes to be different after period analysis change, but was the same.`)
    })
})