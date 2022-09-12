const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const flattenHierarchyObj = require(`../../utilities/flatten-hierarchy-obj`);

let tableObj, hierarchyObj, chartObj;

describe('Hierarchy Chart Navigation - Factors Level - Test 1', () => {
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

    it(`Navigate to Brand Positions Stage`, async function () {
        await navBar.clickBrandPositioning();
        let isBrandPositioningDisplayed = await brandPositioningPage.isBrandPositioningHeaderDisplayed()
        // console.log(`isRelStageDisplayed => ${isRelStageDisplayed}`);
        assert.equal(isBrandPositioningDisplayed, true, "Brand positioning is not displayed")
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true, "Hierarchy banner is not displayed")
    })

    it(`scrape chart for values`, async function () {
        await brandPositioningPage.clickChartViewButton();
        chartObj = await brandPositioningPage.scrapeChart();
        // fs.writeFileSync(`./zzz.chart-obj.json`, JSON.stringify(chartObj, null, 4));
    })

    it(`Scrape hieararchy for values`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
        // fs.writeFileSync(`./zzz.hierarchyObj.json`, JSON.stringify(hierarchyObj, null, 4));
    })

    it(`Scrape table for values`, async function () {
        await brandPositioningPage.clickTableViewButton();
        tableObj = await brandPositioningPage.scrapeAllForPrimaryBrand();
        console.log(`table obj => `, JSON.stringify(tableObj, null, 4));
        // fs.writeFileSync('./zzz.table-obj.json', JSON.stringify(tableObj, null, 4));
    })

    it(`Verify that the Factors is displayed`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        assert.equal(await brandPositioningPage.isConstructDisplayed("Emotional"), true, "Emotional construct is not displayed");
        assert.equal(await brandPositioningPage.isConstructDisplayed("Purpose"), true, "Purpose construct is not displayed");
    })

    it(`Verify that Constructs, Factors and Attributes are all accessible`, async function () {
        let flattened = flattenHierarchyObj(hierarchyObj);
        let constructs = flattened.filter(el => el.type === "construct");
        let factors = flattened.filter(el => el.type === "factor");
        let attributes = flattened.filter(el => el.type === "attribute");

        assert.equal(constructs.length, 2, "Incorrect amount of 'constructs' displayed");
        assert.equal(factors.length, 9, "Incorrect amount of 'factors' displayed");
        assert.equal(attributes.length, 54, "Incorrect amount of 'attributes' displayed")
    })

    it(`Verify that the percentile-ranked Attribute scores are shown in their applicable bar segment`, async function () {
        let flattened = flattenHierarchyObj(hierarchyObj);
        let constructs = flattened.filter(el => el.type === "construct");
        let factors = flattened.filter(el => el.type === "factor");
        let attributes = flattened.filter(el => el.type === "attribute");

        assert.equal(constructs.every(el => el.percentage >= 0 && el.percentage <= 100), true, "'Constructs' are not represented as percentages")
        assert.equal(factors.every(el => el.percentage >= 0 && el.percentage <= 100), true, "'Factors' are not represented as percentages")
        assert.equal(attributes.every(el => el.percentage >= 0 && el.percentage <= 100), true, "'Attributes' are not represented as percentages")
    })

    it(`Verify the Bar Chart percentile scores for the Purpose and Emotional Constructs against the Hierarchy chart`, async function () {

        let primaryBrandKeyPurpose = Object.keys(chartObj["Overview"]["Purpose"]).find(key => chartObj["Overview"]["Purpose"][key].primaryBrand)
        let primaryBrandPurpose = chartObj["Overview"]["Purpose"][primaryBrandKeyPurpose];

        let primaryBrandKeyEmotional = Object.keys(chartObj["Overview"]["Emotional"]).find(key => chartObj["Overview"]["Emotional"][key].primaryBrand)
        let primaryBrandEmotional = chartObj["Overview"]["Emotional"][primaryBrandKeyEmotional];

        let flattened = flattenHierarchyObj(hierarchyObj);
        let purposePillar = flattened.find(el => el.pillarName === "Purpose");
        let emotionalPillar = flattened.find(el => el.pillarName === "Emotional");

        assert.equal(parseFloat(primaryBrandPurpose.percentage), purposePillar.percentage, "Pillar 'Purpose' values do not match between Hierarchy Chart and Bar Chart ")
        assert.equal(parseFloat(primaryBrandEmotional.percentage), emotionalPillar.percentage, "Pillar 'Emotional' values do not match between Hierarchy Chart and Bar Chart ")


    })

    it(`Verify the Bar Chart percentile scores for the Purpose and Emotional Factors against the Hierarchy chart`, async function () {
        //purpose
        let primaryBrandKeyPurposeUniversalConnection = Object.keys(chartObj["Purpose"]["Universal Connection"]).find(key => chartObj["Purpose"]["Universal Connection"][key].primaryBrand)
        let primaryBrandPurposeUniversalConnection = chartObj["Purpose"]["Universal Connection"][primaryBrandKeyPurposeUniversalConnection];

        let primaryBrandKeyPurposeConsistentFocus = Object.keys(chartObj["Purpose"]["Consistent Focus"]).find(key => chartObj["Purpose"]["Consistent Focus"][key].primaryBrand)
        let primaryBrandPurposeConsistentFocus = chartObj["Purpose"]["Consistent Focus"][primaryBrandKeyPurposeConsistentFocus];

        let primaryBrandKeyPurposeSocialImpact = Object.keys(chartObj["Purpose"]["Social Impact"]).find(key => chartObj["Purpose"]["Social Impact"][key].primaryBrand)
        let primaryBrandPurposeSocialImpact = chartObj["Purpose"]["Social Impact"][primaryBrandKeyPurposeSocialImpact];

        let primaryBrandKeyPurposeProtagonism = Object.keys(chartObj["Purpose"]["Protagonism"]).find(key => chartObj["Purpose"]["Protagonism"][key].primaryBrand)
        let primaryBrandPurposeProtagonism = chartObj["Purpose"]["Protagonism"][primaryBrandKeyPurposeProtagonism];


        //emotional
        let primaryBrandKeyEmotionaCompetence = Object.keys(chartObj["Emotional"]["Competence"]).find(key => chartObj["Emotional"]["Competence"][key].primaryBrand)
        let primaryBrandEmotionalCompetence = chartObj["Emotional"]["Competence"][primaryBrandKeyEmotionaCompetence];

        let primaryBrandKeyExcitement = Object.keys(chartObj["Emotional"]["Excitement"]).find(key => chartObj["Emotional"]["Excitement"][key].primaryBrand)
        let primaryBrandEmotionalExcitement = chartObj["Emotional"]["Excitement"][primaryBrandKeyExcitement];

        let primaryBrandKeyRuggedness = Object.keys(chartObj["Emotional"]["Ruggedness"]).find(key => chartObj["Emotional"]["Ruggedness"][key].primaryBrand)
        let primaryBrandEmotionalRuggedness = chartObj["Emotional"]["Ruggedness"][primaryBrandKeyRuggedness];

        let primaryBrandKeySincerity = Object.keys(chartObj["Emotional"]["Sincerity"]).find(key => chartObj["Emotional"]["Sincerity"][key].primaryBrand)
        let primaryBrandEmotionalSincerity = chartObj["Emotional"]["Sincerity"][primaryBrandKeySincerity];

        let primaryBrandKeySophistication = Object.keys(chartObj["Emotional"]["Sophistication"]).find(key => chartObj["Emotional"]["Sophistication"][key].primaryBrand)
        let primaryBrandEmotionalSophistication = chartObj["Emotional"]["Sophistication"][primaryBrandKeySophistication];


        // flatten hierarchy obj for ease of searching
        let flattened = flattenHierarchyObj(hierarchyObj);

        //purpose
        let universalConnection = flattened.find(el => el.pillarName === "Universal Connection");
        let consistentFocus = flattened.find(el => el.pillarName === "Consistent Focus");
        let socialImpact = flattened.find(el => el.pillarName === "Social Impact");
        let protagonism = flattened.find(el => el.pillarName === "Protagonism Factor");

        //emotional
        let competence = flattened.find(el => el.pillarName === "Competence");
        let excitement = flattened.find(el => el.pillarName === "Excitement");
        let ruggedness = flattened.find(el => el.pillarName === "Ruggedness");
        let sincerity = flattened.find(el => el.pillarName === "Sincerity");
        let sophistication = flattened.find(el => el.pillarName === "Sophistication");

        //purpose
        assert.equal(parseFloat(primaryBrandPurposeUniversalConnection.percentage), universalConnection.percentage, "Percentages values for 'Universal Connection` do not match between Hierarchy Chart and Bar Chart")
        assert.equal(parseFloat(primaryBrandPurposeConsistentFocus.percentage), consistentFocus.percentage, "Percentages values for 'Consistent Focus` do not match between Hierarchy Chart and Bar Chart")
        assert.equal(parseFloat(primaryBrandPurposeSocialImpact.percentage), socialImpact.percentage, "Percentages values for 'Social Impact` do not match between Hierarchy Chart and Bar Chart")
        assert.equal(parseFloat(primaryBrandPurposeProtagonism.percentage), protagonism.percentage, "Percentages values for 'Protagonism` do not match between Hierarchy Chart and Bar Chart")

        //emotional
        assert.equal(parseFloat(primaryBrandEmotionalCompetence.percentage), competence.percentage, "Percentages values for 'Competence` do not match between Hierarchy Chart and Bar Chart")
        assert.equal(parseFloat(primaryBrandEmotionalExcitement.percentage), excitement.percentage, "Percentages values for 'Excitement` do not match between Hierarchy Chart and Bar Chart")
        assert.equal(parseFloat(primaryBrandEmotionalRuggedness.percentage), ruggedness.percentage, "Percentages values for 'Ruggedness` do not match between Hierarchy Chart and Bar Chart")
        assert.equal(parseFloat(primaryBrandEmotionalSincerity.percentage), sincerity.percentage, "Percentages values for 'Sincerity` do not match between Hierarchy Chart and Bar Chart")
        assert.equal(parseFloat(primaryBrandEmotionalSophistication.percentage), sophistication.percentage, "Percentages values for 'Sophistication` do not match between Hierarchy Chart and Bar Chart")


    })

})