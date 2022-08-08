const relationshipMap = require('../page-objects/common-components/relationship-map');
const analysisPeriodSelector = require('./common-components/analysis-period-selector-and-filters.js');
const customClick = require('../utilities/custom-click.js');

const scrapeBrandPositioningHierarchyView = require("./common-components/scrape-brand-positioning-hierarchy-view.js");
const scrapeBrandPositionTableView = require("./common-components/scrape-brand-position-table-view.js")
// const { generatePillarsObj } = require("./common-components/scrape-brandpositioning-hierarchy-view.js");


module.exports = {
    getBrandPositioningHeader: async function () {
        let maintXPath = `//main//span[contains(@class, "MuiTypography-root") and text()="Brand Positioning"]`;
        let elem = await $(maintXPath);
        await elem.waitForDisplayed();
        return await elem.isDisplayed();
    },

    clickChartViewButton: async function () {
        let elem = await $(`//button[@title="Chart view tooltip text"]`);
        await elem.isDisplayed();
        await elem.click();
    },

    clickTableViewButton: async function () {
        let elem = await $(`//button[@title="Table view tooltip text"]`);
        await elem.isDisplayed();
        await elem.click();
    },

    clickHierarchyViewButton: async function () {
        let elem = await $(`//button[@title="Hierarchy view tooltip text"]`);
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













    // generatePillarsObj: async function () {

    //     let obj = { children: [] };
    //     await this.scrapeHierarchyForValues(obj)
    //     console.log(`stringifyed =>`, JSON.stringify(obj, null, 4))
    //     return obj;
    // },

    // scrapeHierarchyForValues: async function (obj, existingHeadings = [], chainedHeading = '') {
    //     let child = { children: [] };
    //     chainedHeading = chainedHeading.trim();
    //     let currentLevelPillarHeadings = await this.getPillarHeadingsWithChainedHeading(chainedHeading);
    //     currentLevelPillarHeadings = currentLevelPillarHeadings.filter(heading => heading.length > 0);
    //     let currentHeading = currentLevelPillarHeadings.find(heading => !(existingHeadings.includes(heading))).trim();

    //     console.log(`current Level Pillar Headings  =>`, currentHeading)
    //     if (!!currentHeading) {
    //         existingHeadings.push(currentHeading);
    //         await this.applyPropertiesToPillarObject(child, currentHeading, chainedHeading)
    //         await this.expandOrCollapseRect(currentHeading, chainedHeading)

    //         obj.children.push(child)

    //         let newChainedHeading = chainedHeading.trim() + camelize(currentHeading.trim()) + ":";
    //         let nextLevelEl = await $(`//*[contains(@data-testid, "hc-block-${newChainedHeading}")]`);

    //         let isNextLevelElExisting = await nextLevelEl.isDisplayed({ timeout: 500 });

    //         if (isNextLevelElExisting) {
    //             await this.scrapeHierarchyForValues(child, existingHeadings, newChainedHeading);
    //             await this.expandOrCollapseRect(currentHeading, chainedHeading)
    //         }

    //         let siblings = currentLevelPillarHeadings.filter(heading => !existingHeadings.includes(heading));

    //         if (siblings.length > 0) {
    //             await this.scrapeHierarchyForValues(obj, existingHeadings, chainedHeading);
    //         }
    //     }
    // },

    // expandOrCollapseRect: async function (currentHeading, chainedHeading) {
    //     let currentHeadingFgBox = await this.getFgRect(currentHeading, chainedHeading)
    //     await currentHeadingFgBox.waitForDisplayed({ timeout: 500 });
    //     await currentHeadingFgBox.scrollIntoView();

    //     await currentHeadingFgBox.click({ x: 15, y: 25 })
    // },

    // applyPropertiesToPillarObject: async function (obj, objHeading, chainedHeading) {

    //     const currentValues = {}
    //     currentValues.pillarName =objHeading
    //     currentValues.percentage = await this.determinePercentage(objHeading, chainedHeading);
    //     currentValues.adjacentText = await this.getAdjacentText(objHeading, chainedHeading);
    //     currentValues.readMoreContentHeader = await this.getReadMoreContentHeader(objHeading, chainedHeading);
    //     obj.currentValues = currentValues;

    // },

    // getReadMoreContentHeader: async function (objHeading, chainedHeading) {
    //     let readMoreXpath = `//*[@data-testid="hc-description-${chainedHeading}${camelize(objHeading.replace('/',''))}-more" and text()="Read more"]`;
    //     console.log('readMoreXpath =>', readMoreXpath);
    //     let el = await $(readMoreXpath);
    //     await el.waitForClickable();
    //     await el.click();


    //     let textEl = await $(`//iframe[(contains(@style,'overflow-x: hidden'))]/..//span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${objHeading.toLowerCase().replace('/','&').replace('factor','').trim()}') or contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-', 'abcdefghijklmnopqrstuvwxyz '),'${objHeading.toLowerCase().replace('factor','').trim()}') or  contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-', 'abcdefghijklmnopqrstuvwxyz '),'${objHeading.toLowerCase().replace('factor','').trim()}')]`);
    //     await textEl.waitForDisplayed();
    //     let text = await textEl.getText();
    //     // .//right here trying to find lower case
    //     // let closeButtonXpath = `//span[lower-case(text())="${objHeading.toLowerCase()}"]/../following-sibling::div/button/span`;
    //     let closeButtonXpath = `//span[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')="${objHeading.toLowerCase().replace('/','&')}" or translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-', 'abcdefghijklmnopqrstuvwxyz ')="${objHeading.toLowerCase()}" or translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')="${objHeading.toLowerCase().replace('factor','').trim()}"]/../following-sibling::div/button/span`;
    //     let closeButtonEl = await $(closeButtonXpath);
    //     await closeButtonEl.waitForExist();
    //     await closeButtonEl.waitForClickable();
    //     // await closeButtonEl.click()
    //     await customClick(closeButtonEl);

    //     return text === objHeading ? true: false;
    // },

    // getAdjacentText: async function (objHeader, chainedHeader) {
    //     let adjacentTextXpath = `//*[@data-testid="hc-description-${chainedHeader}${camelize(objHeader)}-line-0"]`;
    //     console.log('adjacentTextXpath =>', adjacentTextXpath);
    //     let adjacentTextEl = await $(adjacentTextXpath);
    //     try {
    //         await adjacentTextEl.waitForDisplayed();
    //     } catch (e) {
    //         return '';
    //     }
    //     return await adjacentTextEl.getText();
    // },

    // getFgRect: async function (objHeading, chainedHeading) {
    //     let fgRectXpath = `//*[@data-testid="hc-block-${chainedHeading}${camelize(objHeading.replace('/',''))}-progress"]`;
    //     console.log('foregroundRectXpath =>', fgRectXpath);
    //     return await $(fgRectXpath)
    // },

    // getBgRect: async function (objHeading, chainedHeading) {
    //     let bgRectXpath = `//*[@data-testid="hc-block-${chainedHeading}${camelize(objHeading.replace('/',''))}-bg"]`;
    //     console.log('bgRectXpath =>', bgRectXpath);
    //     return await $(bgRectXpath)
    // },

    // determinePercentage: async function (objHeading, chainedHeading) {

    //     let fgRect = await this.getFgRect(objHeading, chainedHeading);
    //     await fgRect.waitForDisplayed();

    //     let bgRect = await this.getBgRect(objHeading, chainedHeading);
    //     await bgRect.waitForDisplayed();

    //     fgWidth = await fgRect.getAttribute("width");
    //     bgWidth = await bgRect.getAttribute("width");

    //     return parseInt(fgWidth / bgWidth * 1000) / 10;
    // },

    // getPillarHeadings: async function () {
    //     let elems = await $$(`//*[@class="hc-block-utext"]`);
    //     let headings = await Promise.all(elems.map(async el => {
    //         await el.isDisplayed();
    //         return await el.getText();
    //     }))
    //     return headings;
    // },

    // getPillarHeadingsWithChainedHeading: async function (chainedHeading) {
    //     let xpath = `//*[@class="hc-block-utext" and contains(@data-testid,"${chainedHeading}")]`;
    //     console.log("getPillarHeadingsWithChainedHeading => ", xpath);
    //     let elems = await $$(xpath);
    //     let headings = await Promise.all(elems.map(async el => {
    //         await el.isDisplayed();
    //         return await el.getText();
    //     }))
    //     return headings;
    // },


    ...relationshipMap,
    ...analysisPeriodSelector,
}