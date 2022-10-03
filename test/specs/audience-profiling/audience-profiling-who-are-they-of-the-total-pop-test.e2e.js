const assert = require('assert');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const audienceProfiling = require("../../page-objects/audience-profiling.js");

let pointsPurposeBefore, pointsEmotionalBefore, pointsPurposeAfter, pointsEmotionalAfter;

describe(`Audience Profiling - "Who are they?" of the Total Pop Test`, () => {

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

    it(`Verify that the user switches the demographic charts to display data for the Total Population`, async function () {
        await audienceProfiling.cycleToBrand("Coleman (active gear)");

        let ageSegment = await audienceProfiling.getSegmentAge();
        let genderSegment = await audienceProfiling.getSegmentGender();
        let ethnicitySegment = await audienceProfiling.getSegmentEthnicity();
        let educationSegment = await audienceProfiling.getSegmentEducation();
        let householdIncomeSegment = await audienceProfiling.getSegmentHouseholdIncome();
        let categorySpendSegment = await audienceProfiling.getSegmentCategorySpend();
        let orientationSegment = await audienceProfiling.getSegmentOrientation();
        let shareOfWalletSegment = await audienceProfiling.getSegmentShareOfWallet();

        await audienceProfiling.clickTotalPopulationTab();

        let ageSegmentTotalPop = await audienceProfiling.getSegmentAge();
        let genderSegmentTotalPop = await audienceProfiling.getSegmentGender();
        let ethnicitySegmentTotalPop = await audienceProfiling.getSegmentEthnicity();
        let educationSegmentTotalPop = await audienceProfiling.getSegmentEducation();
        let householdIncomeSegmentTotalPop = await audienceProfiling.getSegmentHouseholdIncome();
        let categorySpendSegmentTotalPop = await audienceProfiling.getSegmentCategorySpend();
        let orientationSegmentTotalPop = await audienceProfiling.getSegmentOrientation();
        let shareOfWalletSegmentTotalPop = await audienceProfiling.getSegmentShareOfWallet();

        await audienceProfiling.clickBrandAudienceTab();

        assert.deepEqual(ageSegment, ageSegmentTotalPop ,"Age does not match between Brand Audience and Total Population when Audience is set to All Respondents.")
        assert.deepEqual(genderSegment, genderSegmentTotalPop ,"Gender does not match between Brand Audience and Total Population when Audience is set to All Respondents.")
        assert.deepEqual(ethnicitySegment, ethnicitySegmentTotalPop ,"Ethnicity does not match between Brand Audience and Total Population when Audience is set to All Respondents.")
        assert.deepEqual(educationSegment, educationSegmentTotalPop ,"Education does not match between Brand Audience and Total Population when Audience is set to All Respondents.")
        assert.deepEqual(householdIncomeSegment, householdIncomeSegmentTotalPop ,"Household Income does not match between Brand Audience and Total Population when Audience is set to All Respondents.")
        assert.deepEqual(categorySpendSegment, categorySpendSegmentTotalPop ,"Category Spend does not match between Brand Audience and Total Population when Audience is set to All Respondents.")
        assert.deepEqual(orientationSegment, orientationSegmentTotalPop ,"Orientation does not match between Brand Audience and Total Population when Audience is set to All Respondents.")
        assert.deepEqual(shareOfWalletSegment, shareOfWalletSegmentTotalPop ,"Share of Wallet does not match between Brand Audience and Total Population when Audience is set to All Respondents.")

    })

    it(`Verify that the Category Spend and Share of Wallet is still filtered by the user’s selected Brand`, async function (){
        let categorySpendSegmentTotalPop = await audienceProfiling.getSegmentCategorySpend();

        await filtersSideBar.clickFiltersButton();
        await filtersSideBar.addPrimaryBrand("Audi");
        await filtersSideBar.clickCloseFiltersButton();
        
        let categorySpendSegmentNewPrimaryBrand = await audienceProfiling.getSegmentCategorySpend();

        let oldKeys = Object.keys(categorySpendSegmentTotalPop);
        let newKeys = Object.keys(categorySpendSegmentNewPrimaryBrand);

        assert.notEqual(oldKeys, newKeys, "Buckets for Category Spend are equal when primary brands are different")
    })

    // it(`Get Who are they values`, async function (){
    //     let ageObject = await audienceProfiling.getSegment("Age");
    //     console.log("ageObject =>", ageObject);
    //     let values = await audienceProfiling.getWhoAreTheySection();
    //     console.log('values =>', values);
    // })

    // it(`checking the cycle to functionality`, async function (){
    //     // Hydro Flask
    //     await audienceProfiling.cycleToBrand("Hydro Flask");
    //     await new Promise(res => { setTimeout(() => { res() }, 15000) })
    // })




})