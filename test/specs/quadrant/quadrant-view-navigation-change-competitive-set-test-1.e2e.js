const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let pointsPurposeBeforeFactors, pointsEmotionalBeforeFactors, pointsPurposeAfterFactors, pointsEmotionalAfterFactors;
let pointsPurposeBeforeAttributes, pointsEmotionalBeforeAttributes, pointsPurposeAfterAttributes, pointsEmotionalAfterAttributes;

describe(`Quadrant View Navigation - Test 1 - Change Competitive Set`, () => {

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

    it(`Change competitive set`, async function () {
        await filtersSideBar.clickFiltersButton();

        await filtersSideBar.removeAllFromCompetitiveSet();
        await filtersSideBar.addCompetitiveSetBrands([
            "Champion Sportswear",
            "Coach (fashion)",
            "Dockers",
            "GUESS"
        ])

        await filtersSideBar.clickCloseFiltersButton();
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