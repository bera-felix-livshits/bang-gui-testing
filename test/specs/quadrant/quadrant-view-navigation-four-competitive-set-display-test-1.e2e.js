const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let pointsPurposeBeforeFactors, pointsEmotionalBeforeFactors, pointsPurposeAfterFactors, pointsEmotionalAfterFactors;
let pointsPurposeBeforeAttributes, pointsEmotionalBeforeAttributes, pointsPurposeAfterAttributes, pointsEmotionalAfterAttributes;

describe(`Quadrant View Navigation - Test 1 - Four Competitive Set Display`, () => {

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
        await brandSelectorPage.addSpecificBrand("International");
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

    it(`Capture points on quadrant`, async function () {
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

    it(`Verify that a warning banner exists`, async function () {
        let errorBannerContents = await brandPositioningPage.getErrorBannerContents();

        assert.equal(errorBannerContents.errorIconDisplayed, true, "Error banner icon SHOULD be displayed but is not")
        assert.equal(errorBannerContents.errorMessage.trim(), "At least 4 brands are required in competitive set. Please add additional brands.", "Error Banner message SHOULD match `At least 4 brands are required in competitive set. Please add additional brands.` but does not")
    })

    it(`Verify that there are no entries in the quandrants`, async function () {
        assert.equal(pointsEmotionalBeforeFactors.length, 0, "Points are displayed on quadrant view for Emotional Factors. They should NOT be displayed when 4 competitive sets are used and one of the competitive sets has a 0 sample size.")
        assert.equal(pointsEmotionalBeforeAttributes.length, 0, "Points are displayed on quadrant view for Emotional Attributes. They should NOT be displayed when 4 competitive sets are used and one of the competitive sets has a 0 sample size.")
        assert.equal(pointsPurposeBeforeFactors.length, 0, "Points are displayed on quadrant view for Purpose Factors. They should NOT be displayed when 4 competitive sets are used and one of the competitive sets has a 0 sample size.")
        assert.equal(pointsPurposeBeforeAttributes.length, 0, "Points are displayed on quadrant view for Purpose Attributes. They should NOT be displayed when 4 competitive sets are used and one of the competitive sets has a 0 sample size.")
    })

    it(`Select a new "Primary Brand"`, async function () {
        await brandPositioningPage.clickFiltersButton();
        await brandPositioningPage.clickEditBrandsButton();
    })

    it(`Add another brand`, async function () {
        await brandSelectorPage.addSpecificBrand("GUESS");
    })

        
    it(`Exit brand selection screen`, async function(){
        await brandSelectorPage.clickSaveButton();
        await brandPositioningPage.clickCloseFiltersButton();
    })

    it(`Capture points on quadrant after having added an additional brand`, async function () {

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

    it(`Verify that a warning banner does not exists`, async function () {
        let errorBannerContents = await brandPositioningPage.getErrorBannerContents();

        assert.equal(errorBannerContents.errorIconDisplayed, false, "Error banner icon should NOT be displayed, but is not.")
        assert.equal(errorBannerContents.errorMessage.trim(), "", "An error message should NOT exist")
    })

    it(`Verify that there are entries in the quandrants`, async function () {
        console.log("pointsEmotionalAfterFactors.length =>", pointsEmotionalAfterFactors.length)
        console.log("pointsEmotionalAfterAttributes.length =>", pointsEmotionalAfterAttributes.length)
        console.log("pointsPurposeAfterFactors.length =>", pointsPurposeAfterFactors.length)
        console.log("pointsPurposeAfterAttributes.length =>", pointsPurposeAfterAttributes.length)

        assert.equal(pointsEmotionalAfterFactors.length > 0, true, "Points are not displayed on quadrant view for Emotional Factors. They SHOULD be displayed when 5 competitive sets are used and one of the competitive sets has a 0 sample size.")
        assert.equal(pointsEmotionalAfterAttributes.length > 0, true, "Points are displayed on quadrant view for Emotional Attributes. They SHOULD not be displayed when 5 competitive sets are used and one of the competitive sets has a 0 sample size.")
        assert.equal(pointsPurposeAfterFactors.length > 0, true, "Points are displayed on quadrant view for Purpose Factors. They SHOULD be displayed when 5 competitive sets are used and one of the competitive sets has a 0 sample size.")
        assert.equal(pointsPurposeAfterAttributes.length > 0, true, "Points are displayed on quadrant view for Purpose Attributes. They SHOULD be displayed when 5 competitive sets are used and one of the competitive sets has a 0 sample size.")
    })
})