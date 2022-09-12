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

    it(`Scrape hieararchy for values`, async function () {
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
        console.log('!!! hierarchy obj =>', JSON.stringify(hierarchyObj, null, 4));
        // fs.writeFileSync('./zzz.hierarchy-obj.json', JSON.stringify(hierarchyObj, null, 4));
    })

    it(`Scrape table for values`, async function () {
        await brandPositioningPage.clickTableViewButton();
        tableObj = await brandPositioningPage.scrapeAllForPrimaryBrand();
        console.log(`table obj => `, JSON.stringify(tableObj, null, 4));
        // fs.writeFileSync('./zzz.table-obj.json', JSON.stringify(tableObj, null, 4));
    })

    // it(`Verify that only all Purpose construct and the Emotional construct exists - No other constructs should be visible`, async function () {
    //     let emotionalNode = hierarchyObj.children.find(el => el.pillarName == "Emotional");
    //     let purposeNode = hierarchyObj.children.find(el => el.pillarName == "Purpose");

    //     assert.equal(emotionalNode.children.length, 5);
    //     assert.equal(purposeNode.children.length, 4);
    // })

    // it(`Verify cascading constructs are all present for "Purpose"`, async function () {
    //     let purposeNode = hierarchyObj.children.find(el => el.pillarName == "Purpose");

    //     assert.equal(purposeNode.children.some(el => el.pillarName == "Universal Connection"), true, "Universal Connection is missing in Purpose");
    //     assert.equal(purposeNode.children.some(el => el.pillarName == "Consistent Focus"), true, "Consistent Focus is missing in Purpose");
    //     assert.equal(purposeNode.children.some(el => el.pillarName == "Social Impact"), true, "Social Impact is missing in Purpose");
    //     assert.equal(purposeNode.children.some(el => el.pillarName == "Protagonism Factor"), true), "Protagonism Factor is missing in Purpose";
    // })

    // it(`Verify cascading constructs are all present for "Emotional"`, async function () {
    //     let emotionalNode = hierarchyObj.children.find(el => el.pillarName == "Emotional");

    //     assert.equal(emotionalNode.children.some(el => el.pillarName == "Competence"), true, "Competence is missing in Emotional");
    //     assert.equal(emotionalNode.children.some(el => el.pillarName == "Excitement"), true, "Excitement is missing in Emotional");
    //     assert.equal(emotionalNode.children.some(el => el.pillarName == "Ruggedness"), true, "Ruggedness is missing in Emotional");
    //     assert.equal(emotionalNode.children.some(el => el.pillarName == "Sincerity"), true, "Sincerity is missing in Emotional");
    //     assert.equal(emotionalNode.children.some(el => el.pillarName == "Sophistication"), true, "Sophistication is missing in Emotional");
    // })

    // it(`Verify "Read Me" values of cascading constructs are all present for "Purpose"`, async function () {
    //     let purposeNode = hierarchyObj.children.find(el => el.pillarName == "Purpose");
    //     assert.equal(purposeNode.children.every(el => el.readMoreContentHeader), true, "There exists a pillar under 'Purpose' that does not have does not have a functioning 'read me' link");
    // })

    // it(`Verify "Read Me" values of cascading constructs are all present for "Emotional"`, async function () {
    //     let emotionalNode = hierarchyObj.children.find(el => el.pillarName == "Emotional");
    //     assert.equal(emotionalNode.children.every(el => el.readMoreContentHeader), true, "There exists a pillar under 'Emotional' that does not have does not have a functioning 'read me' link");
    // })
})