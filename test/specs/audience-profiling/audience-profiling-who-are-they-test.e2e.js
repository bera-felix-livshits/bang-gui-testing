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

    it(`Click pie chart icon`, async function () {
        await audienceProfiling.clickPieChart();
    })

    it(`Verify that the “Who are they section?” visualization appears below the engagement segment bar charts `, async function () {
        let whoAreTheyBarCharts = await audienceProfiling.getWhoAreTheySectionLocationAndSize();
        let whoAreTheyVisualization = await audienceProfiling.getWhoAreTheyVisualizationApCardsLocationsAndSize();

        assert.equal(whoAreTheyVisualization.every(el => (whoAreTheyBarCharts.y + whoAreTheyBarCharts.height) < el.y), true, "There exists an AP Card where an AP Card exist that is displayed above the bar chart segment.")
    })

    it(`Verify that by default, the Engagement Segments bars are only shown for the Primary Brand`, async function () {
        let index = await audienceProfiling.cycleToBrand("Coleman (active gear)")
        assert.equal(index, 0, "Default values for the Engagement segments are not represented for the Primary Brand")
    })

    it(`Verify that by default, all demographic sections are shown, based on the user’s selected country (US Brandscape)`, async function () {
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

        let ageSegment = await audienceProfiling.getSegmentAge();
        let genderSegment = await audienceProfiling.getSegmentGender();
        let ethnicitySegment = await audienceProfiling.getSegmentEthnicity();
        let educationSegment = await audienceProfiling.getSegmentEducation();
        let householdIncomeSegment = await audienceProfiling.getSegmentHouseholdIncome();
        let categorySpendSegment = await audienceProfiling.getSegmentCategorySpend();
        let orientationSegment = await audienceProfiling.getSegmentOrientation();
        let shareOfWalletSegment = await audienceProfiling.getSegmentShareOfWallet();

        assert.notDeepEqual(ageSegment, null, `Age demographic does not exist. Age segment had value of ${ageSegment}`)
        assert.notDeepEqual(genderSegment, null, "Gender demographic does not exist.")
        assert.notDeepEqual(ethnicitySegment, null, "Ethnicity demographic does not exist.")
        assert.notDeepEqual(educationSegment, null, "Education demographic does not exist.")
        assert.notDeepEqual(householdIncomeSegment, null, "Household Income demographic does not exist.")
        assert.notDeepEqual(categorySpendSegment, null, "Category Spend demographic does not exist.")
        assert.notDeepEqual(orientationSegment, null, "Orientation does demographic does not exist.")
        assert.notDeepEqual(shareOfWalletSegment, null, "Share of Wallet demographic does not exist.")

    })

    it(`Reset the country selected to US Brandscape`, async function (){
        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.selectDataSet("BERA US Brandscape");
        await filtersSideBar.addPrimaryBrand("Adidas");
        await filtersSideBar.addCompetitiveSetBrands([
            "Asics",
            "The North Face",
            "Under Armour",
            "Nike"
        ])

        await filtersSideBar.clickCloseFiltersButton();
    })

     it(`Get Who are they values`, async function (){
        values = await audienceProfiling.getWhoAreTheySection();
        fs.writeFileSync(`./who-are-they-values.json`, JSON.stringify(values, null, 4));
    })

    it(`Click on an Engagement Segment in the “How Engaged Are They?” Panel`, async function (){
        await audienceProfiling.clickEngagement()
    })

    it(`Verify that the data for the “Who Are they?” Section becomes filtered to that Engagement Segment`, async function (){
        let engagementSegmentsByBrand = await audienceProfiling.getEngagementSegmentsBarCharts();
        console.log("engagementSegmentsByBrand =>", JSON.stringify(engagementSegmentsByBrand, null, 4))

        fs.writeFileSync(`engagement-segment.json`, JSON.stringify(engagementSegmentsByBrand, null, 4))

        assert.equal(values["Adidas"]["unawares"], engagementSegmentsByBrand["Adidas"]["unawares"].value);
        assert.equal(values["Adidas"]["rejecters"], engagementSegmentsByBrand["Adidas"]["rejecters"].value);
        assert.equal(values["Adidas"]["lapsed"], engagementSegmentsByBrand["Adidas"]["lapsed"].value);
        assert.equal(values["Adidas"]["winbacks"], engagementSegmentsByBrand["Adidas"]["winbacks"].value);
        assert.equal(values["Adidas"]["prospects"], engagementSegmentsByBrand["Adidas"]["prospects"].value);
        assert.equal(values["Adidas"]["switchers"], engagementSegmentsByBrand["Adidas"]["switchers"].value);
        assert.equal(values["Adidas"]["loyals"], engagementSegmentsByBrand["Adidas"]["loyals"].value);
    })

    it(`Hover over the chart legend`, async function (){
        let legend = await audienceProfiling.getLegend();
        await legend.loyals.moveTo();
    })

    it(`Verify that you can see the corresponding series on the chart`, async function (){
        let selected = await audienceProfiling.getConnectors();

        console.log(`Selected by connectors =>`, JSON.stringify(selected, null, 4))
        let loyals = selected.find(el => el.segment === "loyals");
        assert.equal(loyals.selected, true, "Connectors failing to display on mouse the legend");
    })

    it(`Hover over the chart legend`, async function (){
        let legend = await audienceProfiling.getLegend();
        await legend.loyals.moveTo();
    })
    
    it(`Verify that you can see the corresponding legend item`, async function (){
        let tooltipObj = await audienceProfiling.getLegendToolTip();
        assert.equal(tooltipObj.visible, true, "Legend tool tip failed to display")
    })
})