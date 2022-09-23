const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let tableObj, hierarchyObj;

describe('Hierarchy Chart Navigation - Brand Positioning - Test 1', () => {
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

    it(`Scrape hieararchy for values`, async function () {
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
    })

    it(`Scrape table for values`, async function () {
        await brandPositioningPage.clickTableViewButton();
        tableObj = await brandPositioningPage.scrapeAllForPrimaryBrand();
    })

    it(`Verify that only all Purpose construct and the Emotional construct exists - No other constructs should be visible`, async function () {
        let emotionalNode = hierarchyObj.children.find(el => el.pillarName == "Emotional");
        let purposeNode = hierarchyObj.children.find(el => el.pillarName == "Purpose");

        assert.equal(emotionalNode.children.length, 5);
        assert.equal(purposeNode.children.length, 4);
    })

    it(`Verify that there exists text next to the constructs with a brief description of the metric with a link to “View More”`, async function () {

        assert.equal(hierarchyObj.children.some(el => el.adjacentText.includes("Your brand's reason for being beyond making a profit.")), true, "Text adjacent to 'Purpose' is not displayed");
        assert.equal(hierarchyObj.children.some(el => el.adjacentText.includes("How your brand expresses itself to be meaningfully unique.")), true, "Text adjacent to 'Emotional' is not displayed");
    })
})