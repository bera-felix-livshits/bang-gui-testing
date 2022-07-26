const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const fs = require('fs');
const analysisPeriodSelectorAndFilters = require('../../page-objects/page-components/analysis-period-selector-and-filters.js');

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

describe('Hierarchy Chart Sample Size - Test 1', () => {
    this.retries = 0;
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Select the "US Brandscape" dataset.`, async function () {
        await filtersSideBar.selectDataSet("US Brandscape");
    })

    it(`Select 5 brands from the list available`, async function () {
        await filtersSideBar.addPrimaryBrand("Coleman (active gear)");
        await filtersSideBar.addCompetitiveSetBrands([
            "Contigo",
            "Corkcicle",
            "Hydro Flask",
            "Igloo (coolers)"
        ])

        await filtersSideBar.clickCloseFiltersButton();
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

    it('Toggle "Sample Size"', async function () {
      
        await brandPositioningPage.toggleSampleSize()
        let attributes = await brandPositioningPage.getSampleSizeAttributes();
        console.log('!!! Attributes large =>', attributes);
        // confirm tool tip

        let sampleSize = attributes.sampleSize.indexOf('K') ? parseFloat(attributes.sampleSize.replace('K', '')) * 1000 : parseFloat(attributes.sampleSize.replace('K', ''))
        console.log('sample size =>', sampleSize)
        assert.equal(attributes.colour.value === 'rgba(153,153,153,1)', true, "Colour is not black, but should be for sufficient sample size")
        assert.equal(sampleSize >= 385, true, "Sample size number value is outside the boundaries for sufficient sample size (96 <= x <=385)")
    })

    it(`Change audience to produce "moderate" tooltip`, async function (){
        await new Promise(res => {
            setTimeout(() => {
                res();
            }, 15000)
        })

        await filtersSideBar.clickFiltersButton();
        // await analysisPeriodSelectorAndFilters.clickEditPrimaryAudienceButton();
        await filtersSideBar.selectYourAudienceByValue("Black or African American");
        // await audienceDetailsPage.clickSaveAndFinishButton();
        await analysisPeriodSelectorAndFilters.clickCloseFiltersButton();

        let attributes = await brandPositioningPage.getSampleSizeAttributes();
        console.log('!!! Attributes moderate =>', attributes);

        assert.equal(attributes.colour.value === 'rgba(251,120,45,1)', true, "Colour is not orange, but should be for moderate sample size")
        assert.equal(parseInt(attributes.sampleSize) >= 96 && parseInt(attributes.sampleSize) < 385, true, "Sample size number value is outside the boundaries for moderate sample size (96 <= x <=385)")
        assert.equal(attributes.toolTipValue === "Moderate sample size", true, "Tooltip value does not match the exected value of: Moderate sample size")
    })

    // it(`Change audience to produce "low" tooltip`, async function (){
    //     await brandPositioningPage.clickFiltersButton();
    //     await analysisPeriodSelectorAndFilters.clickEditPrimaryAudienceButton();
    //     await audienceDetailsPage.selectYourAudienceByValue("American Indian or Alaska Native");
    //     await audienceDetailsPage.clickSaveAndFinishButton();
    //     await analysisPeriodSelectorAndFilters.clickCloseFiltersButton();

    //     let attributes = await brandPositioningPage.getSampleSizeAttributes();
    //     console.log('!!! Attributes low =>', attributes);

    //     assert.equal(attributes.colour.value === 'rgba(255,82,87,1)', true, "Colour is not red, but should be for low sample size")
    //     assert.equal(parseInt(attributes.sampleSize) < 96, true, "Sample size number value is not less than 96 for low sample size")
    //     assert.equal(attributes.toolTipValue === "Low sample size", true, "Tooltip value does not match the exected value of: Low sample size")
    //     // confirm color
    // })

    // it('Toggle "Sample Size" and confirm that the mouse over elems are not present', async function (){
    //     await brandPositioningPage.toggleSampleSize();
    //     let saampleSize = await brandPositioningPage.getSampleSizeTextValue();

    //     assert.equal(saampleSize, "Sample size element does not exist", "Sample size element exists even though it should not");
    //     // confirm lack of element.

    // })

})