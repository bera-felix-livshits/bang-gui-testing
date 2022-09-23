const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");


describe(`Quadrant View Navigation - SEM Outputs Full Prioritization - Test 1 - Summary View`, () => {
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

    it(`Toggle SEM`, async function () {
        await brandPositioningPage.toggleDrivers();
    })

    it(`Toggle to Attriubtes`, async function () {
        await brandPositioningPage.toggleFactorsAndAttributes()
    })

    it(`Switch to summary view`, async function () {
        await brandPositioningPage.clickQuadrantSummaryViewButton()
    })

    it(`Verify that the Summary view updates to show “Drivers of Primary Brand” Header As Green`, async function () {
        let colourPurpose = await brandPositioningPage.getDriversOfPrimaryBrandsColor();
        console.log(`colour => ${JSON.stringify(colourPurpose, null, 4)}`);

        await brandPositioningPage.clickEmotionalButton();

        let colourEmotional = await brandPositioningPage.getDriversOfPrimaryBrandsColor();

        await brandPositioningPage.clickPurposeButton();

        assert.equal(colourPurpose.value, "rgb(41,214,125)", `Expected Purpose color to be green with value "rgb(41,214,125)" but was ${colourPurpose.value} instead.`)
        assert.equal(colourEmotional.value, "rgb(41,214,125)", `Expected Emotional color to be green with value "rgb(41,214,125)" but was ${colourEmotional.value} instead.`)
    })

    it(`Verify that the Summary view updates to show entries in "Maintain and Build" and "Develop" As Green`, async function () {
        let summaryChartContentsPurpose = await brandPositioningPage.getSummaryChartContents();

        await brandPositioningPage.clickEmotionalButton();

        let summaryChartContentsEmotional = await brandPositioningPage.getSummaryChartContents();

        await brandPositioningPage.clickPurposeButton();

        assert.equal(summaryChartContentsPurpose.maintain.every(el => el.colour.value === "rgb(41,214,125)"), true, "There exists an entry in Purpose 'Maintain and Build' that is not Green")
        assert.equal(summaryChartContentsPurpose.develop.every(el => el.colour.value === "rgb(41,214,125)"), true, "There exists an entry in Purpose 'Develop' that is not Green")
        assert.equal(summaryChartContentsPurpose.deprioritize.every(el => el.colour.value === "rgb(255,255,255)"), true, "There exists an entry in Purpose 'Deprioritize' that is not Grey")

        assert.equal(summaryChartContentsEmotional.maintain.every(el => el.colour.value === "rgb(41,214,125)"), true, "There exists an entry in Emotional 'Maintain and Build' that is not Green")
        assert.equal(summaryChartContentsEmotional.develop.every(el => el.colour.value === "rgb(41,214,125)"), true, "There exists an entry in Emotional 'Develop' that is not Green")
        assert.equal(summaryChartContentsEmotional.deprioritize.every(el => el.colour.value === "rgb(255,255,255)"), true, "There exists an entry in Emotional 'Deprioritize' that is not Grey")

    })

    it(`Set demographics such that Primary Brand is less than 500 and more than 250`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("Black or African American");
        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Verify that the Quadrant view updates to show “Drivers of Primary Brand” As Orange`, async function () {
        let colourPurpose = await brandPositioningPage.getDriversOfSelectedBrandsColor();
        console.log(`colour => ${JSON.stringify(colourPurpose, null, 4)}`);

        await brandPositioningPage.clickEmotionalButton();

        let colourEmotional = await brandPositioningPage.getDriversOfSelectedBrandsColor();

        assert.equal(colourPurpose.value, "rgb(251,120,45)", `Expected Purpose color to be green with value "rgb(41,214,125)" but was ${colourPurpose.value} instead.`)
        assert.equal(colourEmotional.value, "rgb(251,120,45)", `Expected Emotional color to be green with value "rgb(41,214,125)" but was ${colourPurpose.value} instead.`)
    })

    it(`Verify that the Summary view updates to show entries in "Maintain and Build" and "Develop" As Orange`, async function () {
        let summaryChartContentsPurpose = await brandPositioningPage.getSummaryChartContents();

        await brandPositioningPage.clickEmotionalButton();

        let summaryChartContentsEmotional = await brandPositioningPage.getSummaryChartContents();

        await brandPositioningPage.clickPurposeButton();

        assert.equal(summaryChartContentsPurpose.maintain.every(el => el.colour.value === "rgb(251,120,45)"), true, "There exists an entry in Purpose 'Maintain and Build' that is not Orange")
        assert.equal(summaryChartContentsPurpose.develop.every(el => el.colour.value === "rgb(251,120,45)"), true, "There exists an entry in Purpose 'Develop' that is not Orange")
        assert.equal(summaryChartContentsPurpose.deprioritize.every(el => el.colour.value === "rgb(255,255,255)"), true, "There exists an entry in Purpose 'Deprioritize' that is not Grey")

        assert.equal(summaryChartContentsEmotional.maintain.every(el => el.colour.value === "rgb(251,120,45)"), true, "There exists an entry in Emotional 'Maintain and Build' that is not Orange")
        assert.equal(summaryChartContentsEmotional.develop.every(el => el.colour.value === "rgb(251,120,45)"), true, "There exists an entry in Emotional 'Develop' that is not Orange")
        assert.equal(summaryChartContentsEmotional.deprioritize.every(el => el.colour.value === "rgb(255,255,255)"), true, "There exists an entry in Emotional 'Deprioritize' that is not Grey")

    })

    it(`Disable drivers`, async function () {
        await brandPositioningPage.toggleDrivers();
    })

    it(`Navigate away and change demographics `, async function () {
        await navBar.clickBrandLevers();

        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("Native Hawaiian or Other Pacific Islander");
        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`navigate back to quadrant`, async function () {
        await navBar.clickBrandPositioning();
        await brandPositioningPage.clickQuadrantViewButton();
        await brandPositioningPage.toggleDrivers();
    })

    it(`Select summary view`, async function () {
        await brandPositioningPage.clickQuadrantSummaryViewButton();
    })

    it(`Verify that Summary chart does not have points`, async function () {
        let summaryChartContentsPurpose = await brandPositioningPage.getSummaryChartContents();

        await brandPositioningPage.clickEmotionalButton();

        let summaryChartContentsEmotional = await brandPositioningPage.getSummaryChartContents();

        await brandPositioningPage.clickPurposeButton();

        console.log("summaryChartContentsEmotional => ", JSON.stringify(summaryChartContentsEmotional, null, 4))

        await new Promise(res => {
            setTimeout(() => {
                res()
            }, 15000)
        })

        assert.equal(summaryChartContentsPurpose.maintain.length, 0, "There exists an entry in Purpose 'Maintain and Build'")
        assert.equal(summaryChartContentsPurpose.develop.length, 0, "There exists an entry in Purpose 'Develop'")
        assert.equal(summaryChartContentsPurpose.deprioritize.length, 0, "There exists an entry in Purpose 'Deprioritize'")

        assert.equal(summaryChartContentsEmotional.maintain.length, 0, "There exists an entry in Emotional 'Maintain and Build'")
        assert.equal(summaryChartContentsEmotional.develop.length, 0, "There exists an entry in Emotional 'Develop'")
        assert.equal(summaryChartContentsEmotional.deprioritize.length, 0, "There exists an entry in Emotional 'Deprioritize'")
    })
})