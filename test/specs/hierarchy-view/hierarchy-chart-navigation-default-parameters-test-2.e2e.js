const assert = require('assert');

const beraLoginPage = require("../page-objects/bera-login-page.js");
const landingPage = require("../page-objects/landing-page.js");
const brandSelectorPage = require("../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../page-objects/audience-details-page.js");
const navBar = require('../page-objects/common-components/nav-bar.js');
const overviewPage = require("../page-objects/overview-page.js");
const brandPositioningPage = require("../page-objects/brand-positioning-page.js");

let brandNamesSelectedDuringFlow;
let audienceSelected;

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
        audienceSelected = await audienceDetailsPage.getSelectedAudience();
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
        assert.equal(isBrandPositioningDisplayed, true)
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true)
    })

    it(`Verify that the page loads the Hierarchy Chart view`, async function () {
        // let isPurposeChartDisplayed = brandPositioningPage;
        let emotionalPercentage = await brandPositioningPage.getEmotionalChartDisplayedPercentage();
        let purposePercentage = await brandPositioningPage.getPurposeChartDisplayedPercentage();

        assert.equal(emotionalPercentage && emotionalPercentage > 0, true);
        assert.equal(purposePercentage && purposePercentage > 0, true);
    })

    it(`Click on the Filters Button located to the right of the Analysis Period Dropdown button to confirm brands and audience.`, async function () {
        await brandPositioningPage.clickFiltersButton();
        let selectedBrands = await brandPositioningPage.getSelectedBrands()
        await brandPositioningPage.clickCloseFiltersButton();
        //primary brand comparison
        assert.equal(brandNamesSelectedDuringFlow[0], selectedBrands.primaryBrand);

        //comparitive set
        assert.equal(brandNamesSelectedDuringFlow[1], selectedBrands.competitiveSet[0]);
        assert.equal(brandNamesSelectedDuringFlow[2], selectedBrands.competitiveSet[1]);
        assert.equal(brandNamesSelectedDuringFlow[3], selectedBrands.competitiveSet[2]);
        assert.equal(brandNamesSelectedDuringFlow[4], selectedBrands.competitiveSet[3]);

        //comparing audience
        let brandPositioningAudience = await brandPositioningPage.getAudienceBeingUsed();

        assert.equal(audienceSelected, brandPositioningAudience);
    })
})