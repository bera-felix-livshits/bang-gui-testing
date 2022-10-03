const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const audienceProfiling = require("../../page-objects/audience-profiling.js");

const crosstabTable = require("../../page-objects/page-components/crosstab-table.js");

let tableBefore

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

    it(`Navigate to Crosstab view`, async function () {
        await audienceProfiling.clickCrosstab();
    })

    it(`Verify that as a user, that I can view (and compare) all of the demographics for my primary brand and audience by engagement segment.`, async function () {
        tableBefore = await crosstabTable.getTable()
        let coreKeys = Object.keys(tableBefore);
        console.log('coreKeys =>', coreKeys);
        let scrapedDemographics = Object.keys(tableBefore[`tableContents`]);
        console.log("tableContents => ", scrapedDemographics)

        const demographics = [
            'Gender',
            'Age',
            'Income',
            'Ethnicity',
            'Education',
            'Orientation',
            'Share Of Wallet',
            'Category Spend'
        ];

        demographics.forEach(demographic => {
            assert.equal(scrapedDemographics.includes(demographic), true, `Demographic: ${demographic} is missing from scraped demographics.`);
        })

    })

    it(`Verify that as a user, that I can sort by an Engagement Segment by clicking on a column header`, async function () {
        await tableBefore['tableHeaders']['Unawares'].filterEl.click();
        let tableAfter = await crosstabTable.getTable();

        // setting it back to default
        await tableBefore['tableHeaders']['Unawares'].filterEl.click();
        await tableBefore['tableHeaders']['Unawares'].filterEl.click();

        assert.deepEqual(tableBefore["tableContents"], tableAfter["tableContents"], "Tables do not have the same values.")
        assert.notEqual(tableBefore["tableContents"], tableAfter["tableContents"], "Tables should not have the row names in the same order, but do.")
    })

    it(`Verify that as a user, that I can change my primary brand`, async function () {

        await filtersSideBar.clickFiltersButton();
        let selectedBrands = await filtersSideBar.getSelectedBrands();

        await filtersSideBar.addPrimaryBrand("Coleman (active gear)");
        let newBrands = await filtersSideBar.getSelectedBrands();
        await filtersSideBar.clickCloseFiltersButton();

        assert.notDeepEqual(selectedBrands, newBrands, "Brands should be different after selecting a new primary brand, but are not.")
    })

    it(`Verify that as a user, that I can add, change or remove "other" brands`, async function () {

        await filtersSideBar.clickFiltersButton();
        let selectedBrands = await filtersSideBar.getSelectedBrands();

        await filtersSideBar.removeAllFromCompetitiveSet();
        await filtersSideBar.addCompetitiveSetBrands([
            "Igloo (coolers)"
        ]);
        await audienceProfiling.cycleToBrand("Igloo (coolers)");
        let newBrands = await filtersSideBar.getSelectedBrands()
        await filtersSideBar.clickCloseFiltersButton();

        assert.notDeepEqual(selectedBrands, newBrands, "Brands should be different after selecting a new competitive brand, but are not.")

    })

    it(`Verify that as a user, that I can change my audience`, async function () {
        await filtersSideBar.clickFiltersButton();
        let oldAudience = await filtersSideBar.getSelectedAudience();
        await filtersSideBar.selectDataSet("Dell GB");
        let newAudience = await filtersSideBar.getSelectedAudience()

        await filtersSideBar.clickCloseFiltersButton();

        assert.notEqual(oldAudience, newAudience, "Audiences should not be different after change, but are.")
    })

    it(`Verify that as a user, that I can change my country, analysis period and brand`, async function () {
        await filtersSideBar.clickFiltersButton();
        let oldAudience = await filtersSideBar.getSelectedAudience();
        let oldCountryDataSet = await filtersSideBar.getSelectedDataSet();

        await filtersSideBar.selectDataSet("BERA US Brandscape");
        await filtersSideBar.selectYourAudienceByValue("Households with Children (Age 10 or less)");

        let newAudience = await filtersSideBar.getSelectedAudience();
        let newCountryDataSet = await filtersSideBar.getSelectedDataSet();
        await filtersSideBar.clickCloseFiltersButton();

        assert.notEqual(oldAudience, newAudience, "Audience should be different after having been changed, but is not")
        assert.notEqual(oldCountryDataSet, newCountryDataSet, "Country should be different after having been changed, but is not")

    })

    it(`Verify that as a user, that I can see totals by customer and non-customers (shaded in grey)`, async function () {
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectDataSet("US Brandscape");
        await filtersSideBar.addPrimaryBrand("Adidas");
        await filtersSideBar.addCompetitiveSetBrands([
            "Asics",
            "The North Face",
            "Under Armour",
            "Nike"
        ])

        await filtersSideBar.clickCloseFiltersButton();
        let scrapedDemographics = Object.keys(tableBefore[`tableContents`]);

        scrapedDemographics.forEach(demographic => {
            let demographicValues = Object.keys(tableBefore[`tableContents`][demographic]);
            demographicValues.forEach(demographicValue => {
                assert.equal(!!tableBefore[`tableContents`][demographic][demographicValue]["Non-Customers"], true, "Non-Customers should be displayed but are not")
            })
        })

    })

    it(`Verify that as a user, that I can scroll vertically to see all demographic details`, async function () {
        let scrapedDemographics = Object.keys(tableBefore[`tableContents`]);

        scrapedDemographics.forEach(demographic => {
            let demographicValues = Object.keys(tableBefore[`tableContents`][demographic]);
            demographicValues.forEach(demographicValue => {
                assert.equal(!!tableBefore[`tableContents`][demographic][demographicValue]["Unawares"], true, "Unawares should be displayed but is not");
                assert.equal(!!tableBefore[`tableContents`][demographic][demographicValue]["Rejecters"], true, "Rejecters should be displayed but is not");
                assert.equal(!!tableBefore[`tableContents`][demographic][demographicValue]["Winbacks"], true, "Winbacks should be displayed but is not");
                assert.equal(!!tableBefore[`tableContents`][demographic][demographicValue]["Lapsed"], true, "Lapsed should be displayed but is not");
                assert.equal(!!tableBefore[`tableContents`][demographic][demographicValue]["Switchers"], true, "Switchers should be displayed but is not");
                assert.equal(!!tableBefore[`tableContents`][demographic][demographicValue]["Prospects"], true, "Prospects should be displayed but is not");
                assert.equal(!!tableBefore[`tableContents`][demographic][demographicValue]["Loyals"], true, "Loyals should be displayed but is not");
            })
        })

        await new Promise( res => {
            setTimeout(()=>{
                res()
            }, 15000)
        })
    })
})