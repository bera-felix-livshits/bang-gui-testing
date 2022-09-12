const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const navBar = require('../../page-objects/common-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const flattenHierarchyObj = require('../../utilities/flatten-hierarchy-obj');
const fs = require('fs');
const { html2json } = require('html2json');
const analysisPeriodSelectorAndFilters = require('../../page-objects/common-components/analysis-period-selector-and-filters.js');

const brandPositioningInfoContents = JSON.parse(fs.readFileSync('./test/fixtures/brand-positioning-info-content.json'));

let hierarchyObj;
let scrapedInfoContent;

describe('Hierarchy Chart Info Icon - Test 1', () => {
    this.retries = 0;
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
        assert.notEqual(brandEquitySummaryTable["Brand Equity"]["BERA Score"], '');
    })

    it(`Navigate to Brand Positions Stage`, async function () {
        await navBar.clickBrandPositioning();
        let isBrandPositioningDisplayed = await brandPositioningPage.isBrandPositioningHeaderDisplayed()
        assert.equal(isBrandPositioningDisplayed, true)
    })

    it(`Open page Info side bar`, async function () {
        await brandPositioningPage.clickOpenPageInfoButton();
    })

    it(`Get contents of Brand Positioning information side bar`, async function () {
        scrapedInfoContent = html2json((await brandPositioningPage.getPageSideBarInfoContents()));
        assert.deepEqual(scrapedInfoContent, brandPositioningInfoContents, "Scraped Info content does not match expected values found in fixutres.")
    })

    it(`Close page Info side bar`,async function (){
        await brandPositioningPage.clickClosePageInfoButton();
    })

    it(`Verify that info content is not displayed`, async function (){
        let isContentDisplayed = await brandPositioningPage.isBrandPositioningInfoContentShowing();
        assert.equal(isContentDisplayed, false, "Brand Positioning Content Information is visible contrary to expected behaviour.")
    })

})