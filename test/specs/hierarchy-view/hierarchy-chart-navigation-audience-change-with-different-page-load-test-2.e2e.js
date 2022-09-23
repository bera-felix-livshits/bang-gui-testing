const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let sampleSizeBefore, sampleSizeAfter, audience;

describe('Hierarchy Chart Navigation - Audience Change w/ Different page load - Test 2', () => {
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
        sampleSizeBefore = await brandPositioningPage.getSampleSizeAttributes()
        console.log('before sample size =>', sampleSizeBefore);

    })

    it(`Click filters drop down and select "Edit" Primary Audience element`, async function () {
        await filtersSideBar.clickFiltersButton();
    })

    it(`Verify that you are presented with the "Audience Details Page"`, async function () {
        await new Promise( res => setTimeout(()=>{res()}, 15000))
        assert.equal((await filtersSideBar.getSelectedAudience()).toLowerCase(), "All Respondents 18+ US".toLowerCase(), `User is not presented with the "Audience Details" page`);

    })

    it(`Select new value for Audience`, async function () {
        await filtersSideBar.selectYourAudienceByValue("Household Income $0-$25,000");
        await filtersSideBar.clickCloseFiltersButton();
        audience = await brandPositioningPage.getAudienceBeingUsed();
    })

    it(`Verify that the new audience has loaded`, async function () {
        sampleSizeAfter = await brandPositioningPage.getSampleSizeAttributes();
        assert.notEqual(sampleSizeAfter.sampleSize, sampleSizeBefore.sampleSize, "New audience had failed to load");
    })

    it(`Navigate to Hierarchy view`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
    })

    it(`Verify that the new audience is being used in Hierarchy View`, async function () {
        let hierarchyAudience = await brandPositioningPage.getAudienceBeingUsed();
        assert.equal(audience, hierarchyAudience, "Incorrect audience being used in  Hierarchy View");
    })

    it(`Navigate to Relationship Stage`, async function () {
        await navBar.clickRelationshipStage();
    })

    it(`Verify that new audience is being used in Relationship Stage`, async function () {
        let relationshipStageAudience = await brandPositioningPage.getAudienceBeingUsed();
        assert.equal(audience, relationshipStageAudience, "Incorrect audience being used in Relationship Stage");
    })

})