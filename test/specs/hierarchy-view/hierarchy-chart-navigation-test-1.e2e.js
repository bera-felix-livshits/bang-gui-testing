const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

let tableObj, hierarchyObj;

describe('Hierarchy Chart Navigation - Test 1', () => {
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
        let isBrandPositioningDisplayed = await brandPositioningPage.isBrandPositioningHeaderDisplayed()
        // console.log(`isRelStageDisplayed => ${isRelStageDisplayed}`);
        assert.equal(isBrandPositioningDisplayed, true)
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true)
    })

    it(`Scrape hieararchy for values`, async function () {
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
        console.log('!!! hierarchy obj =>', JSON.stringify(hierarchyObj, null, 4));
    })

    it(`Scrape table for values`, async function () {
        await brandPositioningPage.clickTableViewButton();
        tableObj = await brandPositioningPage.scrapeAllForPrimaryBrand();
        console.log(`table obj => `, JSON.stringify(tableObj, null, 4));
    })

    it(`Verify that the page loads the Hierarchy Chart view`, async function () {
        let purposeNode = hierarchyObj.children.find(el => el.pillarName == "Purpose");
        let emotionalNode = hierarchyObj.children.find(el => el.pillarName == "Emotional");

        let purposePercentage = purposeNode.percentage;
        let emotionalPercentage = emotionalNode.percentage;

        console.log('emotionalPercentage =>', emotionalPercentage)
        console.log('purposePercentage =>', purposePercentage)

        assert.equal(emotionalPercentage && emotionalPercentage > 0, true);
        assert.equal(purposePercentage && purposePercentage > 0, true);
    })
})