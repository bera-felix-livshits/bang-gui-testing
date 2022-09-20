const relationshipMap = require('./page-components/relationship-map');
const analysisPeriodSelector = require('./page-components/analysis-period-selector-and-filters.js');
const customClick = require('../utilities/custom-click.js');
const camelize = require('../utilities/camelize');
const hieararchyView = require(`./page-components/hiearchy-view.js`);
const quadrantView = require('./page-components/quadrant-view.js');

const scrapeBrandPositioningHierarchyView = require("./page-helpers/scrape-brand-positioning-hierarchy-view.js");
const scrapeBrandPositionTableView = require("./page-helpers/scrape-brand-position-table-view.js");
const scrapeForQuadrentContent = require("./page-helpers/scrape-brand-position-chart-view.js");
// const { generatePillarsObj } = require("./common-components/scrape-brandpositioning-hierarchy-view.js");

const scrapeBrandPositioningQuandrant = require("./page-helpers/scrape-brand-positioning-quadrant.js");
const waitForLoadingToComplete = require('./page-components/wait-for-loading-to-complete');


module.exports = {

    getNameFromImageIconTopLeft: async function () {
        let els = await $$(`//div/span[text()]/../preceding-sibling::div/img[@alt and @height]`);
        let target = (await Promise.all(els.map(async (el) => {
            await el.waitForExist();
            if (await el.isDisplayed()) {
                return el;
            }
            return null;
        }))).filter(el => el);
        console.log("target.length =>", target.length)
        target = target.find(el => el);
        return await target.getAttribute('alt');
    },

    isBrandPositioningHeaderDisplayed: async function () {
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
        let elem = await $(`//button[@title="DNA view tooltip text"]`);
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
        let featureVisualizationButton = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await featureVisualizationButton.isDisplayed();
        await featureVisualizationButton.click();

        let sampleSizeSpan = await $(`//span[text()="Sample Size"]`);

        await sampleSizeSpan.isDisplayed();
        await sampleSizeSpan.click();

        await browser.keys("\uE00C");
    },

    getToggleSampleSize: async function () {
        let featureVisualizationButton = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await featureVisualizationButton.isDisplayed();
        await featureVisualizationButton.click();

        let el = await $(`//span[text()="Sample Size"]`);
        await el.isDisplayed();

        await browser.keys("\uE00C");
        return el;
    },

    toggleDrivers: async function () {
        let featureVisualizationButton = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await featureVisualizationButton.isDisplayed();
        await featureVisualizationButton.click();

        let driversButton = await $(`//span[text()="Drivers"]`);

        await driversButton.isDisplayed();
        await driversButton.click();

        await waitForLoadingToComplete()
    },

    getToggleDrivers: async function () {
        let featureVisualizationButton = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await featureVisualizationButton.isDisplayed();
        await featureVisualizationButton.click();

        let el = await $(`//span[text()="Drivers"]`);
        await el.isDisplayed();

        await browser.keys("\uE00C");
        return el;
    },

    getSampleSizeTextValue: async function () {
        await new Promise(res => setTimeout(() => { res() }, 250));
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
        await new Promise(res => { setTimeout(() => { res(); }, 250) })
        let sampleSize = await this.getSampleSizeTextValue();
        let el = await $(`//*[name()="img"]/following-sibling::div[@title and @id]/div[@class="bsi-count"]`);
        let colour = await el.getCSSProperty("color")

        let bsiIcon = await $(`//*[name()="img"]/following-sibling::div[@title and @id]/div[@class="bsi-icon"]`);
        await bsiIcon.waitForDisplayed();

        let toolTipTitle = await $(`//div[@title and @id]`)
        let toolTipValue = await toolTipTitle.getAttribute("title");
        return { sampleSize, colour, toolTipValue };
    },

    getSampleSizeAttriubutesFromSidebar: async function () {
        let bsiCountEls = await $$(`//div[@class="MuiCollapse-wrapperInner"]//div[@title and @id]/div[@class="bsi-count"]`);
        let brandNamesEls = await $$(`//div[@class="MuiCollapse-wrapperInner"]//div[@title and @id]/div[@class="bsi-count"]/../../span[1]`);
        let tooltips = await $$(`//div[@class="MuiCollapse-wrapperInner"]//div[@title and @id]`);
        return await Promise.all(bsiCountEls.map(async (el, i) => {
            let brandName = await brandNamesEls[i].getText();
            let tooltip = await tooltips[i].getAttribute('title');
            let sampleSize = await el.getText();
            let colour = await el.getCSSProperty("color");
            return {
                brandName,
                tooltip,
                sampleSize,
                colour
            }
        }))
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

    getPageSideBarInfoContents: async function () {
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

    getPageSideBarHeader: async function () {
        let elem = await $(`//iframe[(contains(@style,'overflow-x: hidden'))]/..//span[string-length(text()) > 0]`);
        await elem.waitForDisplayed();
        return await elem.getText();
    },

    clickCloseSidebar: async function () {
        let elems = await $$(`//*[contains(@d,"M6.225") and @fill="currentColor" ]`);
        elems = await Promise.all(elems.map(async el => {
            await new Promise(res => { setTimeout(() => { res(); }, 250) })
            if (await el.isDisplayed()) {
                return el;
            }
            return null;
        }))
        let el = elems.find(el => el);
        await el.click();
    },

    isBrandPositioningInfoContentShowing: async function () {
        let infoButtonIconEl = await $(`//iframe/preceding-sibling::div//button`);
        await infoButtonIconEl.isExisting();
        let visible = await infoButtonIconEl.isDisplayedInViewport();
        console.log('visible =>', visible)
        return visible;
    },

    ///////////////////////////////// For Hieararchy view


    ...hieararchyView,
    ...quadrantView,
    ...scrapeBrandPositioningHierarchyView,
    ...scrapeBrandPositionTableView,
    ...scrapeForQuadrentContent,
    ...relationshipMap,
    ...analysisPeriodSelector,
    ...scrapeBrandPositioningQuandrant,
    waitForLoadingToComplete
}