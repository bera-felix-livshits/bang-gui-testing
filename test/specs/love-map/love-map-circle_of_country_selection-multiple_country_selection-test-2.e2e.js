const assert = require('assert');

const beraLoginPage = require('../../page-objects/bera-login-page');
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const overviewPage = require("../../page-objects/overview-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const relationshipStage = require('../../page-objects/relationship-page.js');
const analysisPeriodSelector = require('../../page-objects/page-components/analysis-period-selector-and-filters.js');

let brandNamesSelectedDuringFlow;

const customClick = require(`../../utilities/custom-click`); //('../utilities/custom-click.js');

describe('Love Map Controls (Positive Flow) Test 1', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select the 5 brands from sportswear and click "Next" button`, async function () {
        await brandSelectorPage.addSpecificBrand("Adidas");
        await brandSelectorPage.addSpecificBrand("Carhartt");
        await brandSelectorPage.addSpecificBrand("Champion Sportswear");
        await brandSelectorPage.addSpecificBrand("Columbia (clothing)");
        await brandSelectorPage.addSpecificBrand("Dickie's");

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

    it(`Select Custom date for year "2020" as the analysis period.`, async function () {
        await relationshipStage.setIntervalOrAnalysisPeriodInDropdownCustomForYear("2020", "2020");
        let analysisDatesTextValues = await relationshipStage.getDisplayedAnalysisPeriodText();
        console.log(`analysisDatesTextValues => ${analysisDatesTextValues}`)

        assert.equal(analysisDatesTextValues[0], "2020")
        assert.equal(analysisDatesTextValues[1], "2020")

    })

    it(`Click on the 'Map' button located to the right - top of the page directly below the filters button`, async function () {
        await relationshipStage.clickLoveMapIcon();
    })

    it(`Click on the Filters Button located to the right of the Analysis Period Dropdown button.`, async function () {
        await relationshipStage.clickFiltersButton();
        let selectedBrands = await relationshipStage.getSelectedBrands()
        await relationshipStage.clickCloseFiltersButton();
        //primary brand comparison

        console.log(`brandNamesSelectedDuringFlow => ${JSON.stringify(brandNamesSelectedDuringFlow, null, 4)}`);

        console.log(`selectedBrands => ${JSON.stringify(selectedBrands, null ,4)}`)
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
        let isCanadaExisting = await relationshipStage.doesSelectionExist("Canada");
        let isUKExisting = await relationshipStage.doesSelectionExist("UK");
        let isElevationSetToCountryCheckboxSelected = await relationshipStage.isZoomLevelCheckboxSelected("country");
        let isBrandPrimary = await relationshipStage.isBrandPrimary(brandNamesSelectedDuringFlow[0]);
        let isLoveMapTitleDisplayed = await relationshipStage.isLoveMapTitleDisplayed();
        let drawnCirclesLocations = await relationshipStage.getLocationOfCircles();

        console.log(`drawnCircles => ${JSON.stringify(drawnCirclesLocations, null, 4)}`)
        console.log(`\n\nis usa existing => ${isUsaExisting}\n\n`);
        console.log(`\n\n is country checkbox selected => ${isElevationSetToCountryCheckboxSelected}`)
        console.log(`isBrandPrimary Coleman (active gear) => ${isBrandPrimary}`)
        console.log(`drawnCirclesLocations.map(el=>el.country) => ${drawnCirclesLocations.map(el=>el.country)}`)
        console.log(`drawnCirclesLocations.map(el=>el.country).length => ${drawnCirclesLocations.map(el=>el.country).length}`)
        console.log(`drawnCirclesLocations.map(el=>el.country).includes("United States") => ${drawnCirclesLocations.map(el=>el.country).includes("United States")}`)


        assert.equal(isUsaExisting, true);
        assert.equal(isCanadaExisting, false);
        assert.equal(isUKExisting, false);

        assert.equal(await loveMap.isDisplayed(), true);
        assert.equal(isElevationSetToCountryCheckboxSelected, true);
        assert.equal(isBrandPrimary, true);
        assert.equal(isLoveMapTitleDisplayed, true);
        assert.equal(drawnCirclesLocations.map(el=>el.country).includes("United States"), true);
        assert.equal(drawnCirclesLocations.map(el=>el.country).includes("Canada"), false);
        assert.equal(await relationshipStage.isLoveMapTitleDisplayed(), true);

    })
})