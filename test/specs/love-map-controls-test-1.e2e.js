const assert = require('assert');

const beraLoginPage = require("../page-objects/bera-login-page.js");
const landingPage = require("../page-objects/landing-page.js");
const brandSelectorPage = require("../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../page-objects/audience-details-page.js");
const overviewPage = require("../page-objects/overview-page.js");
const navBar = require('../page-objects/common-components/nav-bar.js');
const relationshipStage = require('../page-objects/relationship-page.js');

let brandNamesSelectedDuringFlow;

const customClick = require('../utilities/custom-click.js');

describe('Love Map Controls (Positive Flow) Test 1', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select the first 5 brands from the list available and click "Next" button`, async function () {
        brandNamesSelectedDuringFlow = await brandSelectorPage.getBrandNames(5)
        // console.log('BRAND NAMES:', brandNamesSelectedDuringFlow)
        await brandSelectorPage.selectFirstFiveBrands();
        await brandSelectorPage.clickNextButton();
    })

    it(`Audience Details - click the "Save & Finish" button`, async function () {
        await audienceDetailsPage.clickSaveAndFinishButton();
    })

    it(`Confirm that home page is displayed`, async function () {
        let brandEquitySummaryTable = await overviewPage.getNumericSummaryValues();
        // console.log(`\n\n brandEquitySummaryTable => \n${JSON.stringify(brandEquitySummaryTable, null, 4)}\n\n`)
        assert.notEqual(brandEquitySummaryTable["Brand Equity"]["BERA Score"], '');
    })

    it(`Navigate to Relationship Stage`, async function () {
        await navBar.clickRelationshipStage();
        let isRelStageDisplayed = await relationshipStage.isRelationshipStageVisible()
        // console.log(`isRelStageDisplayed => ${isRelStageDisplayed}`);
        assert.equal(isRelStageDisplayed, true)
    })

    it(`Click on the Analysis Period Dropdown button.`, async function () {
        await relationshipStage.clickAnalysisPeriodDropDown();
        let getAnalysisPeriodApplyButton = await relationshipStage.getApplyButton();
        await getAnalysisPeriodApplyButton.waitForDisplayed();
        assert.equal(await getAnalysisPeriodApplyButton.isDisplayed(), true)
    })

    it(`Select "Last 2 Years" as the analysis period.`, async function () {
        await relationshipStage.setIntervalOrAnalysisPeriodInDropdown("Last 2 Years");
        let analysisDatesTextValues = await relationshipStage.getDisplayedAnalysisPeriodText();
        console.log(`analysisDatesTextValues => ${analysisDatesTextValues}`)
        assert.equal(analysisDatesTextValues[0], "2020")
        assert.equal(analysisDatesTextValues[1], "2021")
    })

    it(`Click on the Filters Button located to the right of the Analysis Period Dropdown button.`, async function () {
        await relationshipStage.clickFiltersButton();
        let selectedBrands = await relationshipStage.getSelectedBrands()
        await relationshipStage.clickCloseFiltersButton();
        //primary brand comparison
        assert.equal(brandNamesSelectedDuringFlow[0], selectedBrands.primaryBrand);

        //comparitive set
        assert.equal(brandNamesSelectedDuringFlow[1], selectedBrands.competitiveSet[0]);
        assert.equal(brandNamesSelectedDuringFlow[2], selectedBrands.competitiveSet[1]);
        assert.equal(brandNamesSelectedDuringFlow[3], selectedBrands.competitiveSet[2]);
        assert.equal(brandNamesSelectedDuringFlow[4], selectedBrands.competitiveSet[3]);

    })

    it(`Click on the 'Map' button located to the right - top of the page directly below the filters button`, async function () {
        await relationshipStage.clickLoveMapIcon();
        let canvasElement = await relationshipStage.getMapCanvas();
        //get 
        await browser.saveElement(canvasElement, "canvasMap-country", {});
    })

    it(`Compare map images`, async function () {
        let canvasElement = await relationshipStage.getMapCanvas();
        assert.equal(await browser.checkElement(canvasElement, 'canvasMap-country', {}), 0)
    })

    it(`try to drag and drop`, async function () {
        await relationshipStage.drawRectangleOnMapCanvasCoveringTheFullMap();
        let isExisting = await relationshipStage.doesSelectionExist("USA");

        console.log(`\n\nis usa existing => ${isExisting}\n\n`);
        assert.equal(isExisting, true);
    })
})