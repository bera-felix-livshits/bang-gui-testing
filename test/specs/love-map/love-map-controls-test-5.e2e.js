const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const landingPage = require("../../page-objects/landing-page.js");
const brandSelectorPage = require("../../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../../page-objects/audience-details-page.js");
const relationshipStage = require('../../page-objects/relationship-page.js');

const analysisPeriodSelector = require('../../page-objects/common-components/analysis-period-selector-and-filters.js');

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

    it(`Remove primary brand in initial setup and confirm that there is still a brand in the Primary Brand placeholder`, async function () {
        await new Promise(res => {
            setTimeout(() => {
                res()
            }, 1500)
        })

        await brandSelectorPage.removePrimaryBrand();
        assert.equal(await brandSelectorPage.isPrimaryBrandElementDisplayed(), true)
    })

    it(`Audience Details - click the "Save & Finish" button`, async function () {
        await audienceDetailsPage.clickSaveAndFinishButton();
    })

    it(`Select "Edit" button for brands`, async function () {
        await relationshipStage.clickFiltersButton();
        await analysisPeriodSelector.clickBrandsEditButton();

        assert.equal(await brandSelectorPage.isPrimaryBrandElementDisplayed(), true);
    })

    it(`Remove Primary Brand and confirm that there is still a brand in the Primary Brand placeholder`, async function () {
        let competitiveBrandsLengthBefore = (await brandSelectorPage.getCompetitiveSetElements()).length;
        await brandSelectorPage.removePrimaryBrand();
        let competitiveBrandsLengthAfter = (await brandSelectorPage.getCompetitiveSetElements()).length;

        console.log(`competitiveBrandsLengthBefore =>`, competitiveBrandsLengthBefore)
        console.log(`competitiveBrandsLengthAfter =>`, competitiveBrandsLengthAfter)

        assert.equal(await brandSelectorPage.isPrimaryBrandElementDisplayed(), true);
        assert.equal(competitiveBrandsLengthBefore > competitiveBrandsLengthAfter, true);
    })

    it(`Clear all selected brands`, async function () {
        await brandSelectorPage.removeAllFromCompetitiveSet();
        await brandSelectorPage.removePrimaryBrand();

        assert.equal((await brandSelectorPage.getCompetitiveSetElements()).length === 0, true);
        assert.equal(await brandSelectorPage.isPrimaryBrandElementDisplayed(), false);
    })

    it(`Add 2 brand and remove the primary brand`, async function () {
        await brandSelectorPage.selectFirstNBrands(2);
        await brandSelectorPage.removePrimaryBrand();

        assert.equal((await brandSelectorPage.getCompetitiveSetElements()).length === 0, true);
        assert.equal(await brandSelectorPage.isPrimaryBrandElementDisplayed(), true);
    })
})