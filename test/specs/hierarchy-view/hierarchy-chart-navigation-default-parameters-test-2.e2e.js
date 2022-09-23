const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let brandNamesSelectedDuringFlow;
let audienceSelected;

let tableObj, hierarchyObj;

describe('Hierarchy Chart Navigation - Default Parameters - Test 2', () => {
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

    it(`Get selected audiance and brands`, async function () {
        await filtersSideBar.clickFiltersButton();
        audienceSelected = await filtersSideBar.getSelectedAudience();
        brandNamesSelectedDuringFlow = await filtersSideBar.getSelectedBrands();
        await filtersSideBar.clickCloseFiltersButton();
        console.log("brandNamesSelectedDuringFlow => ", brandNamesSelectedDuringFlow)
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
       let emotionalPillar = hierarchyObj.children.find(el => el.pillarName == "Emotional");
       let purposePillar = hierarchyObj.children.find(el => el.pillarName == "Purpose");

        assert.equal(emotionalPillar.percentage > 0, true);
        assert.equal(purposePillar.percentage > 0, true);
    })

    it(`Click on the Filters Button located to the right of the Analysis Period Dropdown button to confirm brands and audience.`, async function () {
        await filtersSideBar.clickFiltersButton();
        let selectedBrands = await filtersSideBar.getSelectedBrands()
        await filtersSideBar.clickCloseFiltersButton();
        //primary brand comparison
        assert.equal(brandNamesSelectedDuringFlow.primaryBrand, selectedBrands.primaryBrand);

        //comparitive set
        assert.equal(brandNamesSelectedDuringFlow.competitiveSet[0], selectedBrands.competitiveSet[0]);
        assert.equal(brandNamesSelectedDuringFlow.competitiveSet[1], selectedBrands.competitiveSet[1]);
        assert.equal(brandNamesSelectedDuringFlow.competitiveSet[2], selectedBrands.competitiveSet[2]);
        assert.equal(brandNamesSelectedDuringFlow.competitiveSet[3], selectedBrands.competitiveSet[3]);

        //comparing audience
        let brandPositioningAudience = await brandPositioningPage.getAudienceBeingUsed();

        assert.equal(audienceSelected.toLowerCase(), brandPositioningAudience.toLowerCase());
    })
})