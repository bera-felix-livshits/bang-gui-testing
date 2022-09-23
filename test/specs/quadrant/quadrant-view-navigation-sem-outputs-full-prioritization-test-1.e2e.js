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
        // await new Promise(res => setTimeout(() => {
        //     res();
        // }, 5000))
    })

    it(`Verify that the Quadrant view updates to show “Drivers of Primary Brand” Header As Green`, async function () {
        let colourPurpose = await brandPositioningPage.getDriversOfPrimaryBrandsColor();
        console.log(`colour => ${JSON.stringify(colourPurpose, null, 4)}`);

        await brandPositioningPage.clickEmotionalButton();

        let colourEmotional = await brandPositioningPage.getDriversOfPrimaryBrandsColor();

        await brandPositioningPage.clickPurposeButton();

        assert.equal(colourPurpose.value, "rgb(41,214,125)", `Expected Purpose color to be green with value "rgb(41,214,125)" but was ${colourPurpose.value} instead.`)
        assert.equal(colourEmotional.value, "rgb(41,214,125)", `Expected Emotional color to be green with value "rgb(41,214,125)" but was ${colourEmotional.value} instead.`)
    })

    it(`Verify that points on chart are displayed as Green`, async function () {
        let pointsPurpose = await brandPositioningPage.getAllQuadrantPoints();
        console.log(`purpose points => ${JSON.stringify(pointsPurpose, null, 4)}`)
       
        await brandPositioningPage.clickEmotionalButton();

        let pointsEmotional = await brandPositioningPage.getAllQuadrantPoints();
        console.log(`emotional points => ${JSON.stringify(pointsEmotional, null, 4)}`)

        await brandPositioningPage.clickPurposeButton();

        assert.equal(pointsPurpose.some(el => el.colour.value == "rgb(41,214,125)"), true, "There exist no points which are Green")
        assert.equal(pointsEmotional.some(el => el.colour.value == "rgb(41,214,125)"), true, "There exist no points which are Green")
    })

    it(`Set demographics such that Primary Brand is less than 500 and more than 250`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("Black or African American");
        await filtersSideBar.clickCloseFiltersButton();
        await brandPositioningPage.waitForLoadingToComplete();
    })

    it(`Verify that the Quadrant view updates to show “Drivers of Primary Brand” As Orange`, async function () {
        let colourPurpose = await brandPositioningPage.getDriversOfSelectedBrandsColor();
        console.log(`colour => ${JSON.stringify(colourPurpose, null, 4)}`);

        await brandPositioningPage.clickEmotionalButton();

        let colourEmotional = await brandPositioningPage.getDriversOfSelectedBrandsColor();

        assert.equal(colourPurpose.value, "rgb(251,120,45)", `Expected Purpose color to be green with value "rgb(41,214,125)" but was ${colourPurpose.value} instead.`)
        assert.equal(colourEmotional.value, "rgb(251,120,45)", `Expected Emotional color to be green with value "rgb(41,214,125)" but was ${colourPurpose.value} instead.`)
    })

    it(`Disable drivers`, async function (){
        await brandPositioningPage.toggleDrivers();
    })

    it(`Navigate away and change demographics `, async function () {
        await navBar.clickBrandLevers();

        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("Native Hawaiian or Other Pacific Islander");
        await filtersSideBar.clickCloseFiltersButton();
    })

    it (`navigate back to quadrant`, async function(){
        await navBar.clickBrandPositioning();
        await brandPositioningPage.clickQuadrantViewButton();
    })

    it(`Toggle SEM drivers`, async function (){
        await brandPositioningPage.toggleDrivers()
    })

    it(`Verify that quadrants do not have points`, async function (){
        let pointsPurpose = await brandPositioningPage.getAllQuadrantPoints();
        console.log(`purpose points => ${JSON.stringify(pointsPurpose, null, 4)}`)
       
        await brandPositioningPage.clickEmotionalButton();

        let pointsEmotional = await brandPositioningPage.getAllQuadrantPoints();
        console.log(`emotional points => ${JSON.stringify(pointsEmotional, null, 4)}`)

        await brandPositioningPage.clickPurposeButton();

        assert.equal(pointsPurpose.length, 0, "There should exist no Purpose points in the quadrant view")
        assert.equal(pointsEmotional.length, 0, "There should exist no Emotional points in the quadrant view") 
    })
})