const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const audienceProfiling = require("../../page-objects/audience-profiling.js");

const fs = require('fs');
let values

describe(`Audience Profiling - "Who are they?" of the Total Pop Test`, () => {

    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Select the "US Brandscape" dataset.`, async function () {
        await filtersSideBar.selectDataSet("US Brandscape");
    })

    it(`Select 5 brands from the list available`, async function () {
        await filtersSideBar.addPrimaryBrand("Adidas");
        await filtersSideBar.addCompetitiveSetBrands([
            "Asics",
            "The North Face",
            "Under Armour",
            "Nike"
        ])

        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Confirm that home page is displayed`, async function () {
        let brandEquitySummaryTable = await overviewPage.getNumericSummaryValues();
        assert.notEqual(brandEquitySummaryTable["Brand Equity"]["BERA Score"], '');
    })

    it(`Navigate to Audience Profile`, async function () {
        await navBar.clickAudienceProfile();

        let isHeaderDisplayed = await audienceProfiling.isAudienceProfilingHeaderDisplayed()
        assert.equal(isHeaderDisplayed, true);
    })

    it(`Click map icon`, async function () {
        await audienceProfiling.clickMap();
    })

    it(`Verify that the view changes to "Where are they?" tab`, async function () {
        assert.equal(await audienceProfiling.isWhereAreTheyDisplayed(), true, `Failed to load "Where Are They?" screen`);
    })

    it(`Verify that the user views a map for the country selected as part of the currently selected Audience. (US Only)`, async function () {
        assert.equal(await audienceProfiling.isMapCanvasDisplayed(), true, `Failed to load map on "Where Are They?" screen`);
    })

    it(`Verify that the user can see, to the left, the total estimated population for the currently selected audience in the selected country`, async function () { 
        assert.equal(!!(await audienceProfiling.getPopulationForMapScreen()), true, "Estimated population of currently selected audience should be displayed, but is not");  
    })

    it(`Verify that the user can see an index legend to the upper-right of the map`, async function () { 
        assert.equal(!!(await audienceProfiling.getLegend()), true, "Legend should be displayed, but is not");  
    })

})