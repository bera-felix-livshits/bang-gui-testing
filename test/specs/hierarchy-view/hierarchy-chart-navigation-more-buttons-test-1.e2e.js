const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");
const flattenHierarchyObj = require('../../utilities/flatten-hierarchy-obj');
const fs = require('fs');

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let hierarchyObj;

describe('Hierarchy Chart Navigation - More Buttons - Test 1', () => {
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
        assert.equal(isBrandPositioningDisplayed, true)
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true)
    })

    it(`Scrape hieararchy for values`, async function () {
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
    })

    it(`Verify that read-more-values fixture matches to what is scraped`, async function () {
        const readMoreValues = JSON.parse(fs.readFileSync('./test/fixtures/read-more-values.json').toString());
        const flattenedObj = flattenHierarchyObj(hierarchyObj)
        let failedArr = Object.keys(readMoreValues).filter(key => {
            let targetObj = flattenedObj.find( el => el.pillarName === key)
            if(targetObj.paragraphContent.toLowerCase().trim() != readMoreValues[key].toLowerCase().trim()){
                return targetObj;
            }
        })

        assert.equal(failedArr.length == 0, true, `Failed on the following keys: ${failedArr}`)
    })


})