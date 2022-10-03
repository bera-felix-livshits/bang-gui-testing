const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const audienceProfiling = require("../../page-objects/audience-profiling.js");

let startTimePeriod, endTimePeriod;
let barCharts;

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

    it(`Change my primary brand`, async function () {
        barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        // fs.writeFileSync(`abar-charts.json`,JSON.stringify(barCharts, null, 4))

        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.addPrimaryBrand("Champion Sportswear");
        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Verify that the Primary Brand changes`, async function () {
        let newBarCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        console.log("old bar charts keys =>", Object.keys(barCharts))
        console.log("bar charts keys =>", Object.keys(newBarCharts))
        assert.equal(!!newBarCharts["Adidas"], false, "Adidas should no longer be displayed, but is")
        assert.equal(!!newBarCharts["Champion Sportswear"], true, "Champion Sportswear should be displayed")
    })

    it(`Add another Brand`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.addCompetitiveSetBrands([
            "Carhartt"
        ])
        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Verify that the Brand is added`, async function () {
        let newBarCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        assert.equal(!!newBarCharts["Carhartt"], true, "Champion Sportswear should be displayed")
    })

    it(`Remove a brand`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.removeBrandFromCompetitiveSet("Asics");
        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Verify that the brand is removed`, async function () {
        let newBarCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        assert.equal(!!newBarCharts["Asics"], false, "Asics should no longer be displayed, but is")
    })

    it(`Change the Audience`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectYourAudienceByValue("Household Income $0-$25,000");
        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Verify that the Audience is changed`, async function () {
        await filtersSideBar.clickFiltersButton();
        let selectedAudience = await filtersSideBar.getSelectedAudience();
        await filtersSideBar.clickCloseFiltersButton();
        assert.equal(selectedAudience, "Household Income $0-$25,000", `Audience is not the expected "Household Income $0-$25,000"`)
    })

    it(`Change your Country`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectDataSet("Dell AU");
        await filtersSideBar.addPrimaryBrand("Adidas");
        await filtersSideBar.addCompetitiveSetBrands([
            "Asics",
            "The North Face",
            "Under Armour",
            "Nike"
        ])

        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Verify that the Country is changed`, async function () {
        await filtersSideBar.clickFiltersButton();
        let countryDataSet = await filtersSideBar.getSelectedDataSet();
        await filtersSideBar.clickCloseFiltersButton();
        assert.equal(countryDataSet, "Dell AU", `Expected country to be Dell AU but was ${countryDataSet}`);
    })

    it(`Change the Analysis Period`, async function () {
        await filtersSideBar.clickFiltersButton();

        [startTimePeriod, endTimePeriod] = await filtersSideBar.getAnalysisPeriod()
        await filtersSideBar.clickCloseFiltersButton();
        await filtersSideBar.clickAnalysisPeriodDropDown();
        await filtersSideBar.setIntervalOrAnalysisPeriodInDropdown("Last Year");

    })

    it(`Verify that the Analysis Period is changed`, async function () {
        let [newStartTimePeriod, newEndTimePeriod] = await filtersSideBar.getAnalysisPeriod()

        assert.notEqual(startTimePeriod, newStartTimePeriod, "new start analysis time period is the same as the old start analysis time period, but should be different");
        assert.notEqual(endTimePeriod, newEndTimePeriod, "new end analysis time period is the same as the old end analysis time period, but should be different");
    })
})