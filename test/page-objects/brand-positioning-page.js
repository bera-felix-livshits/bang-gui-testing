const relationshipMap = require('../page-objects/common-components/relationship-map');
const analysisPeriodSelector = require('./common-components/analysis-period-selector-and-filters.js');
const customClick = require('../utilities/custom-click.js');

const scrapeBrandPositioningHierarchyView = require("./common-components/scrape-brand-positioning-hierarchy-view.js");
const scrapeBrandPositionTableView = require("./common-components/scrape-brand-position-table-view.js");
const scrapeBrandPositionChartView = require("./common-components/scrape-brand-position-chart-view.js");
// const { generatePillarsObj } = require("./common-components/scrape-brandpositioning-hierarchy-view.js");


module.exports = {
    getBrandPositioningHeader: async function () {
        let maintXPath = `//main//span[contains(@class, "MuiTypography-root") and text()="Brand Positioning"]`;
        let elem = await $(maintXPath);
        await elem.waitForDisplayed();
        return await elem.isDisplayed();
    },

    getAudienceBeingUsed: async function () {
        let elem = await $(`//div[@style="display: flex; justify-content: center; align-items: center;"]/span/span[string-length(text()) > 0]`)
        await elem.waitForDisplayed();
        return await elem.getText();
    },

    clickChartViewButton: async function () {
        let elem = await $(`//button[@title="Visualize and compare relationship stage based on geography."]`);
        await new Promise(res => { setTimeout(() => { res() }, 100); })
        await elem.isDisplayed();
        await elem.click();
    },

    clickTableViewButton: async function () {
        let elem = await $(`//button[@title="Table view tooltip text"]`);
        await new Promise(res => { setTimeout(() => { res() }, 100); })
        await elem.isDisplayed();
        await elem.click();
    },

    clickHierarchyViewButton: async function () {
        let elem = await $(`//button[@title="Hierarchy view tooltip text"]`);
        await new Promise(res => { setTimeout(() => { res() }, 100); })
        await elem.isDisplayed();
        await elem.click();
    },

    clickQuadrantViewButton: async function () {
        let elem = await $(`//button[@title="Quadrant view tooltip text"]`);
        await elem.isDisplayed();
        await elem.click();
    },


    isHierarchyViewDisplayed: async function () {
        let elem = await $(`//span[text()="Chart View"]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    isHierarchyViewDisplayed: async function () {
        let elem = await $(`//span[text()="Table View"]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    isHierarchyViewDisplayed: async function () {
        let elem = await $(`//span[text()="Hierarchy View"]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    isHierarchyViewDisplayed: async function () {
        let elem = await $(`//span[contains(text(),"Hierarchy View")]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    ...scrapeBrandPositioningHierarchyView,
    ...scrapeBrandPositionTableView,
    ...scrapeBrandPositionChartView,
    ...relationshipMap,
    ...analysisPeriodSelector,
}