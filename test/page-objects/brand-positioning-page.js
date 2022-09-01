const relationshipMap = require('../page-objects/common-components/relationship-map');
const analysisPeriodSelector = require('./common-components/analysis-period-selector-and-filters.js');
const customClick = require('../utilities/custom-click.js');
const camelize = require('../utilities/camelize');

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

    getPrimaryBrandBeingUsed: async function () {
        let elem = await $(`//div[@style="padding-left: 16px; padding-right: 0px; height: 56px;"]/div[count(child::span)=2]/span[1]`);
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


    isChartViewDisplayed: async function () {
        let elem = await $(`//span[text()="Chart View"]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    isTableViewDisplayed: async function () {
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

    toggleSampleSize: async function () {
        let sampleSizeButtonEl = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await sampleSizeButtonEl.isDisplayed();
        await sampleSizeButtonEl.click();

        let sampleSizeSpan = await $(`//span[text()="Sample Size"]`);

        await sampleSizeSpan.isDisplayed();
        await sampleSizeSpan.click();

        await browser.keys("\uE00C");
    },

    getSampleSizeTextValue: async function () {
        await new Promise(res => setTimeout(() => { res() }, 100));
        let el = await $(`//*[name()="img"]/following-sibling::div[@title and @id]/div[@class="bsi-count"]`);
        if (await el.isExisting()) {
            await el.isDisplayed();
            let text = await el.getText();
            if (text === '...') {
                await new Promise(res => setTimeout(() => { res() }, 100));
                text = await this.getSampleSizeTextValue()
            }
            return text;
        }
        return "Sample size element does not exist";
    },

    getSampleSizeAttributes: async function () {
        let sampleSize = await this.getSampleSizeTextValue();
        let el = await $(`//*[name()="img"]/following-sibling::div[@title and @id]/div[@class="bsi-count"]`);
        let colour = await el.getCSSProperty("color")

        let bsiIcon = await $(`//*[name()="img"]/following-sibling::div[@title and @id]/div[@class="bsi-icon"]`);
        await bsiIcon.waitForDisplayed();

        let toolTipTitle = await $(`//div[@title and @id]`)
        let toolTipValue = await toolTipTitle.getAttribute("title");
        return { sampleSize, colour, toolTipValue };
    },

    clickOpenPageInfoButton: async function () {
        let infoButtonIconEl = await $(`//button[contains(@class, "MuiButton-outlined MuiButton-outlinedSizeLarge MuiButton-sizeLarge")]/span/*[name()="svg"]/../..`);
        await infoButtonIconEl.isDisplayed()
        await infoButtonIconEl.click();
    },

    clickClosePageInfoButton: async function () {
        let infoButtonIconEl = await $(`//iframe/preceding-sibling::div//button`);
        await infoButtonIconEl.isDisplayed()
        await infoButtonIconEl.click();
    },

    getPageInfoContents: async function () {
        let iframe = await $(`//iframe[@title="test"]`);
        await iframe.waitForExist();
        await browser.switchToFrame(iframe);
        let contentEl = await $(`//div[@id="bera-aside"]`);
        await contentEl.waitForExist();
        let location = await contentEl.getLocation();
        console.log(`location =>`, location);
        let content = await contentEl.getHTML(contentEl)
        await browser.switchToParentFrame();
        return content;
    },

    isBrandPositioningInfoContentShowing: async function () {
        let infoButtonIconEl = await $(`//iframe/preceding-sibling::div//button`);
        await infoButtonIconEl.isExisting();
        let visible = await infoButtonIconEl.isDisplayedInViewport();
        console.log('visible =>', visible)
        return visible;
    },

    ///////////////////////////////// For Hieararchy view
    clickConstructBox: async function (constructName) {
        // let el = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-bg"]`);
        let el = await $(`//*[name()="text" and text()="${constructName}"]`);
        await el.waitForDisplayed();
        await el.click();
    },

    getConstructBoxPercentageFill: async function (constructName) { 
        let progressRect = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-progress"]`);
        let backgroundRect = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-bg"]`)

        progressRect = await progressRect.getAttribute("width");
        backgroundRect = await backgroundRect.getAttribute("width");

        return Math.round(progressRect / backgroundRect * 1000) / 10;
    },

    isConstructDisplayed: async function (constructName){
        let el = await $(`//*[name()="text" and text()="${constructName}"]`);
        await el.waitForExist();
        let progressRect = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-progress"]`);
        await progressRect.waitForExist();
        let backgroundRect = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-bg"]`)
        await backgroundRect.waitForExist();
        return (await el.isDisplayed() && await progressRect.isDisplayed() && await backgroundRect.isDisplayed());
    },

    getConstructReadMoreElement: async function (constructName){
        let el = await $(`//*[name()="text" and contains(@data-testid,"${camelize(constructName)}") and text()="Read more"]`);
        await el.waitForDisplayed();
        return el;
    },

    ...scrapeBrandPositioningHierarchyView,
    ...scrapeBrandPositionTableView,
    ...scrapeBrandPositionChartView,
    ...relationshipMap,
    ...analysisPeriodSelector,
}