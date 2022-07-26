const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const analysisPeriodSelectorAndFilters = require('../../page-objects/page-components/analysis-period-selector-and-filters.js');

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

describe(`Quadrant View Navigation - Sample Size - Test 1`, () => {

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

    it(`Toggle sample size`, async function () {
        await brandPositioningPage.toggleSampleSize()
    })

    it(`Confirm grey text for sufficient sample size`, async function () {
        let attributes = await brandPositioningPage.getSampleSizeAttributes();
        await brandPositioningPage.clickFiltersButton();
        let sideBarAttributes = await brandPositioningPage.getSampleSizeAttriubutesFromSidebar();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton()

        assert.equal(attributes.colour.value, 'rgba(153,153,153,1)', "Text is not Grey for brands with sufficient sample size.")
        assert.equal(sideBarAttributes.every(attribute => attribute.colour.value === 'rgba(153,153,153,1)'), true, "Side bar attributes are not Grey")
    })

    it(`Set Audience to "Black or African American" To produce Orange text for moderate Sample Size`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("Black or African American");
        await filtersSideBar.clickCloseFiltersButton()
    })

    it(`Verify that the Sample Size text is Orange`, async function () {
        
        let attributes = await brandPositioningPage.getSampleSizeAttributes();
        await brandPositioningPage.clickFiltersButton();
        let sideBarAttributes = await brandPositioningPage.getSampleSizeAttriubutesFromSidebar();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton()

        assert.equal(attributes.colour.value, 'rgba(251,120,45,1)', "Text is not Orange for brands with moderate sample size.")
        assert.equal(sideBarAttributes.every(attribute => attribute.colour.value === 'rgba(251,120,45,1)'), true, "Side bar attributes are not Orange")
    })

    it(`Set Audience to "American Indian or Alaska Native" To produce Red text for low Sample Size`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("American Indian or Alaska Native");
        await filtersSideBar.clickCloseFiltersButton()
    })

    it(`Verify that the Sample Size text is Orange`, async function () {
        let attributes = await brandPositioningPage.getSampleSizeAttributes();
        await brandPositioningPage.clickFiltersButton();
        let sideBarAttributes = await brandPositioningPage.getSampleSizeAttriubutesFromSidebar();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton()
        console.log('attributes =>', attributes);
        assert.equal(attributes.colour.value, 'rgba(255,82,87,1)', "Text is not Red for brands with low sample size.")
        assert.equal(sideBarAttributes.every(attribute => attribute.colour.value === 'rgba(255,82,87,1)'), true, "Side bar attributes are not Red")
    })


})