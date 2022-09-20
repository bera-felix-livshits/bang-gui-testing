const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../page-objects/audience-details-page.js");
const overviewPage = require("../../page-objects/overview-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const relationshipStage = require('../../page-objects/relationship-page.js');

let brandNamesSelectedDuringFlow;

const analysisPeriodSelector = require('../../page-objects/page-components/analysis-period-selector-and-filters.js');

describe('Love Map Controls (Positive Flow) Test 1', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select the first 5 brands from the list available and click "Next" button`, async function () {
        await brandSelectorPage.selectFirstFiveBrands();
        brandNamesSelectedDuringFlow = await brandSelectorPage.getSelectedBrands();
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

    it(`Click on the 'Map' button located to the right - top of the page directly below the filters button`, async function () {
        await relationshipStage.clickLoveMapIcon();
        // let canvasElement = await relationshipStage.getMapCanvas();
        //get 
        // await browser.saveElement(canvasElement, "canvasMap-country", {});
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

    it(`Create a new audience and confirm that it is applied {Region is set to Alabama}`, async function () {
        await relationshipStage.clickFiltersButton();
        await relationshipStage.clickEditPrimaryAudienceButton();
        await relationshipStage.clickAddFilterToYourAudienceButton(); 

        await relationshipStage.createAndSelectPrimaryAudience("Region", "Alabama");

        await audienceDetailsPage.insertNameForAudience("Test sample")
        await audienceDetailsPage.clickSaveAndFinishButton();

        await relationshipStage.clickCloseFiltersButton();
        await assert.equal(await analysisPeriodSelector.isPrimaryAudienceDisplays("Test sample"), true);
    })

    it(`Validate that circles appear for US & Canada`, async function () {

        await relationshipStage.drawRectangleOnMapCanvasCoveringTheFullMap();
        let loveMap = await relationshipStage.getLoveMap();
        let isUsaExisting = await relationshipStage.doesSelectionExist("USA");
        let isElevationSetToCountryCheckboxSelected = await relationshipStage.isZoomLevelCheckboxSelected("country");
        let isBrandPrimary = await relationshipStage.isBrandPrimary(brandNamesSelectedDuringFlow[0]);
        let isLoveMapTitleDisplayed = await relationshipStage.isLoveMapTitleDisplayed();
        let drawnCirclesLocations = await relationshipStage.getLocationOfCircles();
      
        let brandValuesForCustomAudience = await relationshipStage.getSelectionMapDataValues("USA");
        await relationshipStage.clickCancelNewSelectionButton();

        await relationshipStage.clickFiltersButton();
        await relationshipStage.clickEditPrimaryAudienceButton();
        await audienceDetailsPage.selectYourAudienceByValue("All Respondents 18+ US")
        await audienceDetailsPage.clickSaveAndFinishButton();

         await relationshipStage.drawRectangleOnMapCanvasCoveringTheFullMap();
        let brandValuesForDefaultAudience = await relationshipStage.getSelectionMapDataValues("USA");


        console.log(`brandValuesForCustomAudience => ${JSON.stringify(brandValuesForCustomAudience, null, 4)}`)
        console.log(`brandValuesForDefaultAudience => ${JSON.stringify(brandValuesForDefaultAudience, null ,4)}`)


        assert.equal(await loveMap.isDisplayed(), true);
        assert.equal(isUsaExisting, true);
        assert.equal(isElevationSetToCountryCheckboxSelected, true);
        assert.equal(isBrandPrimary, true);
        assert.equal(isLoveMapTitleDisplayed, true);
        assert.equal(drawnCirclesLocations.map(el => el.country).includes("United States"), true);
        assert.equal(drawnCirclesLocations.map(el => el.country).includes("Canada"), false);
        assert.equal(await relationshipStage.isLoveMapTitleDisplayed(), true);

        assert.equal(JSON.stringify(brandValuesForCustomAudience) != JSON.stringify(brandValuesForDefaultAudience), true);
    })

})

// await relationshipStage.selectFilter("Test sample", "Region","Alabama");
        // await audienceDetailsPage.selectFilterOptions("Test sample", "Region","Alabama");

        // // Use for negative tests - no sample available with first five brands.
        // // await relationshipStage.selectFilter("Test sample", "Credit Score","Very good (740-799)", "Good (670-739)");
        // // await audienceDetailsPage.selectFilterOptions("Test sample", "Credit Score","Very good (740-799)", "Good (670-739)");
        // // Unable to save your audience (check console)

        // await audienceDetailsPage.clickApplyFilterButton();
        // await audienceDetailsPage.insertNameForAudience("Test sample")
        // await audienceDetailsPage.clickSaveAndFinishButton();