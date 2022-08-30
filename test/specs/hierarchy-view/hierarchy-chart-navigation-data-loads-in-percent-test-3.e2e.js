const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let tableObj, hierarchyObj;

describe('Hierarchy Chart Navigation - Brand Positioning - More Button Test 2', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
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
        let isBrandPositioningDisplayed = await brandPositioningPage.getBrandPositioningHeader()
        // console.log(`isRelStageDisplayed => ${isRelStageDisplayed}`);
        assert.equal(isBrandPositioningDisplayed, true, "Brand positioning is not displayed")
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true, "Hierarchy banner is not displayed")
    })

    it(`Scrape hieararchy for values`, async function () {
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
        console.log('!!! hierarchy obj =>', JSON.stringify(hierarchyObj, null, 4));
        fs.writeFileSync('./zzz.hierarchy-obj.json', JSON.stringify(hierarchyObj, null, 4));
    })

    it(`Scrape table for values`, async function () {
        await brandPositioningPage.clickTableViewButton();
        tableObj = await brandPositioningPage.scrapeAllForPrimaryBrand();
        console.log(`table obj => `, JSON.stringify(tableObj, null, 4));
        fs.writeFileSync('./zzz.table-obj.json', JSON.stringify(tableObj, null, 4));
    })

    it(`Verify that data for both the Purpose and Emotional constructs are loaded and their percentile-ranked scores are shown in the applicable charts`, async function () {
        assert.equal(hierarchyObj.children.every(pillar => pillar.percentage && typeof pillar.percentage === 'number'), true, "Percentage is not displayed as a number");
    })

    it(`Verify that NO data will be available for the Functional and Experiential Constructs`, async function () {
        let purposePillar = hierarchyObj.children.find(pillar => pillar.pillarName === "Purpose")
        let purpProtagonismFactorPillar = purposePillar.children.find(el => el.pillarName === "Protagonism Factor")
        let purpSocialImpactPillar = purposePillar.children.find(el => el.pillarName === "Social Impact")
        let purpConsistentFocusPillar = purposePillar.children.find(el => el.pillarName === "Consistent Focus")
        let purpUniversalConnectionPillar = purposePillar.children.find(el => el.pillarName === "Universal Connection")

        let emotionalPillar = hierarchyObj.children.find(pillar => pillar.pillarName === "Emotional")
        let emoSophisticationPillar = emotionalPillar.children.find(el => el.pillarName === "Sophistication")
        let emoSincerityPillar = emotionalPillar.children.find(el => el.pillarName === "Sincerity")
        let emoRuggednessPillar = emotionalPillar.children.find(el => el.pillarName === "Ruggedness")
        let emoExcitementPillar = emotionalPillar.children.find(el => el.pillarName === "Excitement")
        let emoCompetencePillar = emotionalPillar.children.find(el => el.pillarName === "Competence")

        assert.equal(purposePillar.percentage, parseFloat(tableObj["Overview"]["values"]["Purpose"], "Functional percentages do not match between hiearchy and table views"))
        assert.equal(emotionalPillar.percentage, parseFloat(tableObj["Overview"]["values"]["Emotional"], "Emotional percentages do not match between hiearchy and table views"))
        
        assert.equal(purpProtagonismFactorPillar.percentage, parseFloat(tableObj["Purpose"]["values"]["Protagonism"], "Protaganism factor does not match between hierarchy and table views"))
        assert.equal(purpSocialImpactPillar.percentage, parseFloat(tableObj["Purpose"]["values"]["Social Impact"], "Social Impact factor does not match between hierarchy and table views"))
        assert.equal(purpConsistentFocusPillar.percentage, parseFloat(tableObj["Purpose"]["values"]["Consistent Focus"], "Consistent Focus does not match between hierarchy and table views"))
        assert.equal(purpUniversalConnectionPillar.percentage, parseFloat(tableObj["Purpose"]["values"]["Universal Connection"], "Universal Connection does not match between hierarchy and table views"))

        assert.equal(emoSophisticationPillar.percentage, parseFloat(tableObj["Emotional"]["values"]["Sophistication"], "Sophistication does not match between hierarchy and table views"))
        assert.equal(emoSincerityPillar.percentage, parseFloat(tableObj["Emotional"]["values"]["Sincerity"], "Sincerity does not match between hierarchy and table views"))
        assert.equal(emoRuggednessPillar.percentage, parseFloat(tableObj["Emotional"]["values"]["Ruggedness"], "Ruggedness does not match between hierarchy and table views"))
        assert.equal(emoExcitementPillar.percentage, parseFloat(tableObj["Emotional"]["values"]["Excitement"], "Excitement does not match between hierarchy and table views"))
        assert.equal(emoCompetencePillar.percentage, parseFloat(tableObj["Emotional"]["values"]["Competence"], "Competence does not match between hierarchy and table views"))

    })
})