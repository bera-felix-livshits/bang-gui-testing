const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

describe(`Quadrant View Navigation - Hover Over Attribute - Test 2`, () => {

    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select 5 brands from the list available and click "Next" button`, async function () {
        // await brandSelectorPage.selectFirstFiveBrands();
        // brandNamesSelectedDuringFlow = await brandSelectorPage.getSelectedBrands();
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

    it(`Click Purpose button`, async function () {
        await brandPositioningPage.clickPurposeButton();
    })

    it(`Toggle Factors to Attributes`, async function(){
        await brandPositioningPage.toggleFactorsAndAttributes();
    })

    it(`Verify that Grey Oval appears on mouse over`, async function () {
        let point = await brandPositioningPage.getQuadrantPointComponents("Humanitarian")
        let text = point.text;

        await text.isDisplayed();
        await text.moveTo();

        let point2 = await brandPositioningPage.getQuadrantPointComponents("Humanitarian");
        let rect = point2.rect;

        let fill, stroke;

        fill = await rect.getCSSProperty("fill-opacity")
        stroke = await rect.getCSSProperty("stroke-opacity")

        console.log("fill => ", fill)
        console.log("stroke => ", stroke)

        assert.equal(parseFloat(fill) !== 0, true, "fill-opacity needs to be not zero");
        assert.equal(parseFloat(stroke) !== 0, true, "fill-opacity needs to be not zero");
    })

    it(`Verify that side bar appears on click`, async function () {
        let point = await brandPositioningPage.getQuadrantPointComponents("Humanitarian")
        let text = point.text;
        await text.click();
        let sideBarHeaderText = await brandPositioningPage.getPageSideBarHeader();
        let sideBarContent = await brandPositioningPage.getPageSideBarInfoContents();
        await brandPositioningPage.clickCloseSidebar()

        assert.equal(sideBarHeaderText.length > 0, true, "Side Bar header is not displayed");
        assert.equal(sideBarContent.length > 0, true, "Side Bar content is not displayed");
    })
})