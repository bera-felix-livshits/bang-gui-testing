const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

describe(`Quadrant View Navigation - SEM Outputs No Prioritization - Test 1`, () => {

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

    it(`Select a Primary Brand has a sample size < 250 aware respondents`, async function (){
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("Native Hawaiian or Other Pacific Islander");
        await filtersSideBar.clickCloseFiltersButton();
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

    it(`Toggle SEM`, async function () {
        await brandPositioningPage.toggleDrivers();
    })

    it(`Toggle to Attriubtes`, async function () {
        // await new Promise(res => setTimeout(() => {
        //     res();
        // }, 5000))
        await brandPositioningPage.toggleFactorsAndAttributes()
        
    })

    it(`Switch to summary view`, async function () {
        await brandPositioningPage.clickQuadrantSummaryViewButton()
    })

    it(`Verify that the Summary view updates to show Header is not displayed`, async function () {
      
        let colourOfPrimaryPurpose = await brandPositioningPage.getDriversOfPrimaryBrandsColor();
        let colourOfSelectedPurpose = await brandPositioningPage.getDriversOfSelectedBrandsColor()

        await brandPositioningPage.clickEmotionalButton();

        let colourOfPrimaryEmotional = await brandPositioningPage.getDriversOfPrimaryBrandsColor();
        let colourOfSelecteEmotional = await brandPositioningPage.getDriversOfSelectedBrandsColor()

        await brandPositioningPage.clickPurposeButton();

        assert.equal(colourOfPrimaryPurpose, null, `Expected that for Purpose "Drivers of Primary Brand" header does not exist, but it does`);
        assert.equal(colourOfPrimaryEmotional, null, `Expected that for Emotional "Drivers of Primary Brand" header does not exist, but it does`);

        assert.equal(colourOfSelectedPurpose, null, `Expected that for Emotional "Drivers of Primary Brand" header does not exist, but it does`);
        assert.equal(colourOfSelecteEmotional, null, `Expected that for Emotional "Drivers of Primary Brand" header does not exist, but it does`);
    })

    it(`Verify that Summary chart does not have points`, async function (){
        let summaryChartContentsPurpose = await brandPositioningPage.getSummaryChartContents();

        await brandPositioningPage.clickEmotionalButton();

        let summaryChartContentsEmotional = await brandPositioningPage.getSummaryChartContents();

        await brandPositioningPage.clickPurposeButton();

        assert.equal(summaryChartContentsPurpose.maintain.length, 0, "There exists an entry in Purpose 'Maintain and Build' that is not Orange")
        assert.equal(summaryChartContentsPurpose.develop.length, 0, "There exists an entry in Purpose 'Develop' that is not Orange")
        assert.equal(summaryChartContentsPurpose.deprioritize.length, 0, "There exists an entry in Purpose 'Deprioritize' that is not Grey")

        assert.equal(summaryChartContentsEmotional.maintain.length, 0, "There exists an entry in Emotional 'Maintain and Build' that is not Orange")
        assert.equal(summaryChartContentsEmotional.develop.length, 0, "There exists an entry in Emotional 'Develop' that is not Orange")
        assert.equal(summaryChartContentsEmotional.deprioritize.length, 0, "There exists an entry in Emotional 'Deprioritize' that is not Grey")
    })
})