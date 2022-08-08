const assert = require('assert');

const beraLoginPage = require("../page-objects/bera-login-page.js");
const landingPage = require("../page-objects/landing-page.js");
const brandSelectorPage = require("../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../page-objects/audience-details-page.js");
const navBar = require('../page-objects/common-components/nav-bar.js');
const overviewPage = require("../page-objects/overview-page.js");
const brandPositioningPage = require("../page-objects/brand-positioning-page.js");

describe('Love Map Controls (Positive Flow) Test 1', () => {
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

    it(`Verify that only all Purpose construct and the Emotional construct exists - No other constructs should be visible`, async function () {
        let pillarsText = await brandPositioningPage.getAllPillarsBlockText();
        console.log('pillarsText => ', pillarsText)

        assert.equal(pillarsText.length, 2, "There are not exactly 2 pillars that are displayed");
        assert.equal(pillarsText.includes("Emotional"), true, "'Emotional' Pillar is not dispalyed");
        assert.equal(pillarsText.includes("Purpose"), true, "'Purpose' Pillar is not dispalyed");
    })

    it(`Verify that there exists text next to the constructs with a brief description of the metric with a link to “View More”`, async function () {
        let adjancentText = await brandPositioningPage.getPillarChartAdjacentText();
        let readMoreLinks = await brandPositioningPage.getAllReadMoreLinks()

        assert.equal(adjancentText.length, 2);
        assert.equal(adjancentText.includes("Your brand's reason for being beyond making a profit."), true, "Text adjacent to 'Purpose' is not displayed");
        assert.equal(adjancentText.includes("How your brand expresses itself to be meaningfully unique."), true, "Text adjacent to 'Emotional' is not displayed");

        assert.equal(readMoreLinks.length, 2);
        assert.equal(await readMoreLinks[0].isClickable(), true, "Read More for 'Purpose' is not clickable");
        assert.equal(await readMoreLinks[1].isClickable(), true,  "Read More for 'Emotional' is not clickable");
    })
})