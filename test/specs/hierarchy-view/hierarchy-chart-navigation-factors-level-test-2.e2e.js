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

describe('Hierarchy Chart Navigation - Factors Level - Test 2', () => {
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
        assert.equal(isBrandPositioningDisplayed, true, "Brand positioning is not displayed")
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true, "Hierarchy banner is not displayed")
    })

    it(`Scrape hieararchy for values`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
        console.log('!!! hierarchy obj =>', JSON.stringify(hierarchyObj, null, 4));
    })

    it(`Verify that the Factors is displayed`, async function () {
        let flattened = flattenHierarchyObj(hierarchyObj);

        let factorConstructs =flattened.filter(el => el.type === "factor");
        assert.equal(factorConstructs.length, 9, "There are factors missing from the hierarchy.")
    })

    it(`Verify that the correct colors are assigned to the constructs: All Purpose metrics are apricot, All Emotional metrics are orange`, async function () {
        let flattened = flattenHierarchyObj(hierarchyObj);

        let purposeMetrics = flattened.filter(el => el.parents.includes("Purpose") || el.pillarName === "Purpose" );
        let emotionalMetrics = flattened.filter(el => el.parents.includes("Emotional" || el.pillarName === "Emotional"));

        assert.equal(purposeMetrics.every(el => el.color.value === "rgb(255,187,0)"), true, "Color mismatch on 'purpose' metrics");
        assert.equal(emotionalMetrics.every(el => el.color.value === "rgb(251,120,45)"), true, "Color mismatch on 'purpose' metrics");
    })

    it(`Verify that no other colors or shades of Apricot or Orange are used`, async function () {
        let flattened = flattenHierarchyObj(hierarchyObj);
        assert.equal(flattened.every(el => el.color.value !== "rgb(251,120,45)" && el.color.value !== "rgb(255,187,0)"), 0, "Other colors are represented than 'Orange' or 'Apricot'")
    })

    // it(`Verify that the Brand Positioning Attributes are listed alphabetically`, async function () {

    // })

})