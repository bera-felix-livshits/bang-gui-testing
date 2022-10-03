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

    it(`Verify that you can see a stacked bar chart where each bar chart will show the % breakdown of the current audience by engagement segment`, async function () {
        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();

        let brands = Object.keys(barCharts);
        brands.forEach(brand => {
            let brandValues = barCharts[brand];
            let brandEngagementSegments = Object.keys(brandValues);

            assert.equal([
                "unawares",
                "rejecters",
                "lapsed",
                "winbacks",
                "prospects",
                "switchers",
                "loyals"
            ].every(el => brandEngagementSegments.indexOf(el) > -1), true, `Engagement Segments are missing from the brand: ${brand}`);
        })
    })

    it(`Verify that the percentage of each Engagement Segment is visible within the corresponding segment of the horizontal bar chart`, async function () {
        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();

        let brands = Object.keys(barCharts);
        brands.forEach(brand => {
            let brandValues = barCharts[brand];
            let brandEngagementSegments = Object.keys(brandValues);
            brandEngagementSegments.forEach(segment => {
                if (!(segment === "nonCustomers" || segment === "customers")) {
                    assert.equal(barCharts[brand][segment].value.indexOf("%") > -1, true, `${brand}: doesn not represent ${segment} value as a percentage`)
                }
            })
        })
    })

    it(`Verify that above each bar chart, the percentage of Non-customers and Customers is shown`, async function () {
        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();

        let brands = Object.keys(barCharts);
        brands.forEach(brand => {
            assert.equal(barCharts[brand].nonCustomers.indexOf("%") > -1, true, `Percentages are missing for non-customers in brand ${brand}`);
            assert.equal(barCharts[brand].customers.indexOf("%") > -1, true, `Percentages are missing for customers in brand ${brand}`);
        })
    })

    it(`Verify that the color key for the chart will display at the top (each color represents an engagement segment)`, async function () {
        let legend = await audienceProfiling.getLegend();

        let unawaresColour = await legend.unawares.getCSSProperty("fill");
        let rejectersColour = await legend.rejecters.getCSSProperty("fill");
        let lapsedColour = await legend.lapsed.getCSSProperty("fill");
        let winbacksolour = await legend.winbacks.getCSSProperty("fill");
        let prospectsColour = await legend.prospects.getCSSProperty("fill");
        let switchersColour = await legend.switchers.getCSSProperty("fill");
        let loyalsColour = await legend.loyals.getCSSProperty("fill");

        assert.equal(unawaresColour.value, 'rgb(41,187,255)', `unawares block has colour ${unawaresColour.value}, but should have 'rgb(41,187,255)'.`)
        assert.equal(rejectersColour.value, 'rgb(255,122,127)', `rejecters block has colour ${rejectersColour.value}, but should have 'rgb(255,122,127)'.`)
        assert.equal(lapsedColour.value, 'rgb(252,146,85)', `lapsed block has colour ${lapsedColour.value}, but should have 'rgb(252,146,85)'.`)
        assert.equal(winbacksolour.value, 'rgb(255,187,0)', `winbacks block has colour ${winbacksolour.value}, but should have 'rgb(255,187,0)'.`)
        assert.equal(prospectsColour.value, 'rgb(255,209,82)', `prospects block has colour ${winbacksolour.value}, but should have 'rgb(255,209,82)'.`)
        assert.equal(switchersColour.value, 'rgb(34,180,105)', `switchers block has colour ${switchersColour.value}, but should have 'rgb(34,180,105)'.`)
        assert.equal(loyalsColour.value, 'rgb(21,111,65)', `loyals block has colour ${loyalsColour.value}, but should have 'rgb(21,111,65)'.`)
    })

    it(`Verify that the color key for the chart will display at the top (each color represents an engagement segment).`, async function () {
        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        Object.keys(barCharts).forEach(brand => {
            assert.equal(barCharts[brand].unawares.color.value, 'rgb(41,187,255)', `Brand: ${brand} unawares segment has color: ${barCharts[brand].unawares.color.value}, but should have rgb(41,187,255).`)
            assert.equal(barCharts[brand].rejecters.color.value, 'rgb(255,122,127)', `Brand: ${brand} rejecters segment has color: ${barCharts[brand].rejecters.color.value}, but should have rgb(255,122,127).`)
            assert.equal(barCharts[brand].lapsed.color.value, 'rgb(252,146,85)', `Brand: ${brand} lapsed segment has color: ${barCharts[brand].lapsed.color.value}, but should have rgb(252,146,85).`)
            assert.equal(barCharts[brand].winbacks.color.value, 'rgb(255,187,0)', `Brand: ${brand} winbacks segment has color: ${barCharts[brand].winbacks.color.value}, but should have rgb(255,187,0).`)
            assert.equal(barCharts[brand].prospects.color.value, 'rgb(255,209,82)', `Brand: ${brand} prospects segment has color: ${barCharts[brand].prospects.color.value}, but should have rgb(255,209,82).`)
            assert.equal(barCharts[brand].switchers.color.value, 'rgb(34,180,105)', `Brand: ${brand} switchers segment has color: ${barCharts[brand].switchers.color.value}, but should have rgb(34,180,105).`)
            assert.equal(barCharts[brand].loyals.color.value, 'rgb(21,111,65)', `Brand: ${brand} loyals segment has color: ${barCharts[brand].loyals.color.value}, but should have rgb(21,111,65).`)
        })
    })

    it(`Verify that the Series colors follow the rules specified in the UI Kit`, async function () {
        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        Object.keys(barCharts).forEach(brand => {
            let indexedSegmens = Object.keys(barCharts[brand]);

            assert.equal(barCharts[brand][indexedSegmens[0]].color.value, 'rgb(41,187,255)', `Brand: ${brand} unawares segment has color: ${barCharts[brand].unawares.color.value}, but should have rgb(41,187,255).`)
            assert.equal(barCharts[brand][indexedSegmens[1]].color.value, 'rgb(255,122,127)', `Brand: ${brand} rejecters segment has color: ${barCharts[brand].rejecters.color.value}, but should have rgb(255,122,127).`)
            assert.equal(barCharts[brand][indexedSegmens[2]].color.value, 'rgb(252,146,85)', `Brand: ${brand} lapsed segment has color: ${barCharts[brand].lapsed.color.value}, but should have rgb(252,146,85).`)
            assert.equal(barCharts[brand][indexedSegmens[3]].color.value, 'rgb(255,187,0)', `Brand: ${brand} winbacks segment has color: ${barCharts[brand].winbacks.color.value}, but should have rgb(255,187,0).`)
            assert.equal(barCharts[brand][indexedSegmens[4]].color.value, 'rgb(255,209,82)', `Brand: ${brand} prospects segment has color: ${barCharts[brand].prospects.color.value}, but should have rgb(255,209,82).`)
            assert.equal(barCharts[brand][indexedSegmens[5]].color.value, 'rgb(34,180,105)', `Brand: ${brand} switchers segment has color: ${barCharts[brand].switchers.color.value}, but should have rgb(34,180,105).`)
            assert.equal(barCharts[brand][indexedSegmens[6]].color.value, 'rgb(21,111,65)', `Brand: ${brand} loyals segment has color: ${barCharts[brand].loyals.color.value}, but should have rgb(21,111,65).`)
        })
    })

    it(`Verify that the series colors in the legend and the horizontal bar charts are consistent with each other`, async function () {
        let legend = await audienceProfiling.getLegend();

        let unawaresColour = await legend.unawares.getCSSProperty("fill");
        let rejectersColour = await legend.rejecters.getCSSProperty("fill");
        let lapsedColour = await legend.lapsed.getCSSProperty("fill");
        let winbacksolour = await legend.winbacks.getCSSProperty("fill");
        let prospectsColour = await legend.prospects.getCSSProperty("fill");
        let switchersColour = await legend.switchers.getCSSProperty("fill");
        let loyalsColour = await legend.loyals.getCSSProperty("fill");

        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        console.log("Object.keys(barCharts) => ", Object.keys(barCharts))
        Object.keys(barCharts).forEach(brand => {
            assert.equal(barCharts[brand].unawares.color.value, unawaresColour.value, `Brand: ${brand} has unawars bar chart color: ${barCharts[brand].unawares.color.value}, but does not match legend color ${unawaresColour.value}.`)
            assert.equal(barCharts[brand].rejecters.color.value, rejectersColour.value, `Brand: ${brand} has rejecters bar chart color: ${barCharts[brand].rejecters.color.value}, but does not match legend color ${rejectersColour.value}.`)
            assert.equal(barCharts[brand].lapsed.color.value, lapsedColour.value, `Brand: ${brand} has lapsed bar chart color: ${barCharts[brand].lapsed.color.value}, but does not match legend color ${lapsedColour.value}.`)
            assert.equal(barCharts[brand].winbacks.color.value, winbacksolour.value, `Brand: ${brand} has winbacks bar chart color: ${barCharts[brand].winbacks.color.value}, but does not match legend color ${winbacksolour.value}.`)
            assert.equal(barCharts[brand].prospects.color.value, prospectsColour.value, `Brand: ${brand} has prospects bar chart color: ${barCharts[brand].prospects.color.value}, but does not match legend color ${prospectsColour.value}.`)
            assert.equal(barCharts[brand].switchers.color.value, switchersColour.value, `Brand: ${brand} has switchers bar chart color: ${barCharts[brand].switchers.color.value}, but does not match legend color ${switchersColour.value}.`)
            assert.equal(barCharts[brand].loyals.color.value, loyalsColour.value, `Brand: ${brand} has loyals bar chart color: ${barCharts[brand].loyals.color.value}, but does not match legend color ${loyalsColour.value}.`)
        })
    })

    it(`Verify that the legend always shows the following Engagement Segments (and in this order - left to right), even if there is no data for a particular segment: `, async function () {
        let legend = await audienceProfiling.getLegend();
        let legendSegments = Object.keys(legend);

        console.log("legendSegments =>", legendSegments)
        assert.equal(legendSegments[0], "unawares", `was ${legendSegments[0]} but should have been unawares.`)
        assert.equal(legendSegments[1], "rejecters", `was ${legendSegments[1]} but should have been rejecters.`)
        assert.equal(legendSegments[2], "lapsed", `was ${legendSegments[2]} but should have been lapsed.`)
        assert.equal(legendSegments[3], "winbacks", `was ${legendSegments[3]} but should have been winbacks.`)
        assert.equal(legendSegments[4], "prospects", `was ${legendSegments[4]} but should have been prospects.`)
        assert.equal(legendSegments[5], "switchers", `was ${legendSegments[5]} but should have been switchers.`)
        assert.equal(legendSegments[6], "loyals", `was ${legendSegments[6]} but should have been loyals.`)
    })

    it(`Verify that the following segments are shown under Non-Customers: Unawares, Rejectors, Lapsed, Winbacks, Prospects`, async function () {
        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        fs.writeFileSync("./bar-charts.json", JSON.stringify(barCharts, null, 4))
        let brandNames = Object.keys(barCharts);


        brandNames.forEach(brandName => {
            let desiredSegments = Object.keys(barCharts[brandName]).filter(key => ["switchers", "loyals"].indexOf(key) === -1).filter(key => ["nonCustomers", "customers"].indexOf(key) === -1);
            console.log(`desiredSegments => ${desiredSegments}`);
            console.log(`is desired segments an array ${Array.isArray(desiredSegments)}`)
            desiredSegments.forEach(desiredSegment => {
                assert.equal(barCharts[brandName][desiredSegment].group, "non-customers", `Execting brand: ${brandName} for segment:${desiredSegment} to be a non-customer, was actually ${barCharts[brandName][desiredSegment].group}`)
            })
        })
    })

    it(`Verify that the following segments are shown under Customers: Switchers, Loyals`, async function () {
        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();
        fs.writeFileSync("./bar-charts.json", JSON.stringify(barCharts, null, 4))
        let brandNames = Object.keys(barCharts);


        brandNames.forEach(brandName => {
            let desiredSegments = Object.keys(barCharts[brandName]).filter(key => ["switchers", "loyals"].indexOf(key) > -1).filter(key => ["nonCustomers", "customers"].indexOf(key) === -1);
            console.log(`desiredSegments => ${desiredSegments}`);
            console.log(`is desired segments an array ${Array.isArray(desiredSegments)}`)
            desiredSegments.forEach(desiredSegment => {
                assert.equal(barCharts[brandName][desiredSegment].group, "customers", `Execting brand: ${brandName} for segment:${desiredSegment} to be a customers, was actually ${barCharts[brandName][desiredSegment].group}`)
            })
        })
    })

    it(`Varify that each brand, the engagement segments always add up to 100%`, async function () {
        let barCharts = await audienceProfiling.getEngagementSegmentsBarCharts();

        let brands = Object.keys(barCharts);
        brands.forEach(brand => {
            let brandValues = barCharts[brand];
            let brandEngagementSegments = Object.keys(brandValues);
            let segmentValues = brandEngagementSegments.map(segment => barCharts[brand][segment].value).filter(el => el);
            console.log('segment values =>', segmentValues)
            let totalPercent = segmentValues.reduce((prevVal, currVal) => {
                    let massagedVal = parseFloat(currVal.replace("%", ""));
                    return prevVal + massagedVal
            }, 0)

            assert.equal(totalPercent, 100, `The sum of the engagement segments scraped for brand: ${brand} do not add up to 100, actual value is ${totalPercent}`);
        })
    })
})