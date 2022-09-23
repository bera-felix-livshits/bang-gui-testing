const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let sampleSizeBefore, sampleSizeAfter;

describe('Hierarchy Chart Navigation - Audience Change - Test 1', () => {
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

    it(`Enable sample size`, async function () {
        await brandPositioningPage.toggleSampleSize();
        sampleSizeBefore = await brandPositioningPage.getSampleSizeTextValue()
        console.log('before sample size =>', sampleSizeBefore);

    })

    it(`Click filters drop down`, async function () {
        await filtersSideBar.clickFiltersButton();
    })

    it(`Verify that you are presented with the "Audience Details Page"`, async function () {
        assert.equal((await filtersSideBar.getSelectedAudience()).toLowerCase(), "All Respondents 18+ US".toLowerCase(), `User is not presented with the "Audience Details" page`);

    })

    it(`Select new value for Audience`, async function () {
        await filtersSideBar.selectYourAudienceByValue("Household Income $0-$25,000");
        await filtersSideBar.clickCloseFiltersButton()
    })

    it(`Verify that the new audience has loaded`, async function () {
        sampleSizeAfter = await brandPositioningPage.getSampleSizeTextValue();
        assert.notEqual(sampleSizeAfter, sampleSizeBefore, "New audience had failed to load");
    })

    it(`Set audience back to default`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("All respondents 18+ US");
        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Verify that the audience is back to it's default value`, async function () {
        let assumedDefaultAudienceSize = await brandPositioningPage.getSampleSizeTextValue();
        assert.equal(assumedDefaultAudienceSize, sampleSizeBefore, "Audience was not reset back to default");
    })

})