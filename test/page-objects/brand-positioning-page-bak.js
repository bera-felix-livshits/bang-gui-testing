const relationshipMap = require('../page-objects/common-components/relationship-map');
const analysisPeriodSelector = require('./common-components/analysis-period-selector-and-filters.js');

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





    
    //`//*[@id="hc-purpose"]`
    getPurposeChartDisplayedPercentage: async function () {
        let parentXpath = `//*[@id="hc-purpose"]`;
        let backgroundChartEl = await $(parentXpath + '/*[@class="hc-block-bg"]');
        let valueChartEl = await $(parentXpath + '/*[@data-testid="hc-block-purpose-progress"]');
        let bgWidth = Number(await backgroundChartEl.getAttribute('width'));
        let valueWidth = Number(await valueChartEl.getAttribute('width'));

        return parseInt((valueWidth / bgWidth) * 100);
    },
    
    getEmotionalChartDisplayedPercentage: async function () {
        let parentXpath = `//*[@id="hc-emotional"]`;
        let backgroundChartEl = await $(parentXpath + '/*[@class="hc-block-bg"]');
        let valueChartEl = await $(parentXpath + '/*[@class="hc-block-progress"]');
        let bgWidth = Number(await backgroundChartEl.getAttribute('width'));
        let valueWidth = Number(await valueChartEl.getAttribute('width'));

        return parseInt((valueWidth / bgWidth) * 100);
    },

    getAudienceBeingUsed: async function () {
        let elem = await $(`//div[@style="display: flex; justify-content: center; align-items: center;"]/span/span[string-length(text()) > 0]`)
        await elem.waitForDisplayed();
        return await elem.getText();
    },

    getAllPillarsBlockText: async function () {
        let elems = await $$(`//*[@class="hc-block-utext"]`);
        await Promise.all(elems.map(async el => {
            await el.waitForExist();
            return true;
        }))
        return await Promise.all(elems.map(async el => {
            await el.waitForDisplayed();
            return await el.getText();
        }))
    },

    getAllReadMoreLinks: async function () { 
        let elems = await $$(`//*[@class="hc-block-description-more" and text()="Read more"]`);
        await Promise.all(elems.map(async el => {
            await el.waitForExist();
            return true;
        }))
        return elems
    },

    getAllPillarBlockBackgrounds: async function () {
        let elems = await $$(`//*[@class="hc-block-bg"]`);
        await Promise.all(elems.map(async el => {
            await el.waitForExist();
            return true;
        }))
        return elems
    },

    getDisplayedReadMoreContentBannerText: async function () {
        let elems = $$(`//button[@class="MuiButtonBase-root MuiIconButton-root"]/../preceding-sibling::div/span[string-length(text()) > 0]`);
        let [visibleBannerContentEl, ..._] = await Promise.all(elems.filter(async el => {
            let isDisplayed = await el.isDisplayed();
            if(isDisplayed){
                return el;
            }
        }))

        return await visibleBannerContentEl.getText();
    },

    getPillarChartAdjacentText: async function () {
        let elems = await $$(`//*[@class="hc-block-description-text"]`)
        await Promise.all(elems.map(async el => {
            await el.waitForExist();
            return true;
        }))
        return await Promise.all(elems.map(async el => {
            await el.waitForDisplayed();
            return await el.getText();
        }))
    },

    ...relationshipMap,
    ...analysisPeriodSelector,
}