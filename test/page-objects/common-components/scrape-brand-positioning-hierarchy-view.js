const camelize = require('../../utilities/camelize');
const customClick = require('../../utilities/custom-click.js');

module.exports = {

    generatePillarsObj: async function () {
        await new Promise(res => { setTimeout(() => { res() }, 200) })
        let patientEl = await $(`//*[text()="Read more"]`)
        await patientEl.waitForDisplayed();

        let obj = { children: [] };
        await this.scrapeHierarchyForValues(obj)
        return obj;
    },

    scrapeHierarchyForValues: async function (obj, existingHeadings = [], chainedHeading = '') {
        let child = { children: [] };
        chainedHeading = chainedHeading.trim();
        let currentLevelPillarHeadings = await this.getPillarHeadingsWithChainedHeading(chainedHeading);
        currentLevelPillarHeadings = currentLevelPillarHeadings.filter(heading => heading.length > 0);
        let currentHeading = currentLevelPillarHeadings.find(heading => !(existingHeadings.includes(heading)));

        console.log(`current Level Pillar Headings  =>`, currentHeading)
        if (!!currentHeading) {
            existingHeadings.push(currentHeading);
            await this.applyPropertiesToPillarObject(child, currentHeading, chainedHeading)
            await this.expandOrCollapseRect(currentHeading, chainedHeading)

            obj.children.push(child)

            let newChainedHeading = chainedHeading.trim() + camelize(currentHeading.trim()) + ":";
            let nextLevelEl = await $(`//*[contains(@data-testid, "hc-block-${newChainedHeading}")]`);

            let isNextLevelElExisting = await nextLevelEl.isDisplayed({ timeout: 500 });

            if (isNextLevelElExisting) {
                await this.scrapeHierarchyForValues(child, existingHeadings, newChainedHeading);
                await this.expandOrCollapseRect(currentHeading, chainedHeading)
            }

            let siblings = currentLevelPillarHeadings.filter(heading => !existingHeadings.includes(heading));

            if (siblings.length > 0) {
                await this.scrapeHierarchyForValues(obj, existingHeadings, chainedHeading);
            }
        }
    },

    expandOrCollapseRect: async function (currentHeading, chainedHeading) {
        let currentHeadingFgBox = await this.getFgRect(currentHeading, chainedHeading)
        await currentHeadingFgBox.waitForDisplayed({ timeout: 500 });
        await currentHeadingFgBox.scrollIntoView();

        await currentHeadingFgBox.click({ x: 15, y: 25 })
    },

    applyPropertiesToPillarObject: async function (obj, objHeading, chainedHeading) {

        // const currentValues = {}
        obj.pillarName = objHeading
        obj.percentage = await this.determinePercentage(objHeading, chainedHeading);
        obj.adjacentText = await this.getAdjacentText(objHeading, chainedHeading);
        let [readMoreContent, paragraphContent] = await this.getReadMoreContentHeader(objHeading, chainedHeading)
        obj.readMoreContentHeader = readMoreContent.length > 0;
        obj.readMoreContentHeaderValue = readMoreContent;
        obj.paragraphContent = paragraphContent;
        obj.color = await this.getPillarColor(objHeading, chainedHeading);
        // obj.currentValues = currentValues;

    },

    getPillarColor: async function (objHeading, chainedHeading) {
        let fgRect = await this.getFgRect(objHeading, chainedHeading);
        return await fgRect.getCSSProperty('fill');
    },

    getReadMoreContentHeader: async function (objHeading, chainedHeading) {
        let readMoreXpath = `//*[@data-testid="hc-description-${chainedHeading}${camelize(objHeading.replace('/', ''))}-more" and text()="Read more"]`;
        console.log('readMoreXpath =>', readMoreXpath);

        let el = await $(readMoreXpath);
        await el.waitForClickable();
        await el.click();

        await new Promise(res => { setTimeout(() => { res() }, 100) })
        // let textEl = await $(`//iframe[(contains(@style,'overflow-x: hidden'))]/..//span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${objHeading.toLowerCase().replace('/', '&').replace('factor', '').trim()}') or contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-', 'abcdefghijklmnopqrstuvwxyz '),'${objHeading.toLowerCase().replace('factor', '').trim()}') or  contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-', 'abcdefghijklmnopqrstuvwxyz '),'${objHeading.toLowerCase().replace('factor', '').trim()}')]`);
        let textEl = await $(`//iframe[(contains(@style,'overflow-x: hidden'))]/..//span[string-length(text()) > 0]`);
        await textEl.waitForDisplayed();
        let headerText = await textEl.getText();

        let readMoreFrame = await $(`//iframe[@title and not(contains(@title,"test"))]`)
        await readMoreFrame.waitForExist();
        await browser.switchToFrame(readMoreFrame)
        let paragraphEl = await $(`//div[@class="bera-p"]`);
        await paragraphEl.isDisplayed()
        let paragraph = await paragraphEl.getText();
        await browser.switchToParentFrame()

        let closeButtonXpath = `//span[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')="${objHeading.toLowerCase().replace('/', '&')}" or translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-', 'abcdefghijklmnopqrstuvwxyz ')="${objHeading.toLowerCase()}" or translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')="${objHeading.toLowerCase().replace('factor', '').trim()}"]/../following-sibling::div/button/span`;
        let closeButtonEl = await $(closeButtonXpath);
        await closeButtonEl.waitForExist();
        await closeButtonEl.waitForClickable();

        // await closeButtonEl.click()
        await customClick(closeButtonEl);

        // return text === objHeading ? true : false;
        return [headerText, paragraph]; //(text.length > 0);
    },

    getAdjacentText: async function (objHeader, chainedHeader) {
        let adjacentTextXpath = `//*[@data-testid="hc-description-${chainedHeader}${camelize(objHeader)}-line-0"]`;
        console.log('adjacentTextXpath =>', adjacentTextXpath);
        let adjacentTextEl = await $(adjacentTextXpath);
        try {
            await adjacentTextEl.waitForDisplayed();
        } catch (e) {
            return '';
        }
        return await adjacentTextEl.getText();
    },

    getFgRect: async function (objHeading, chainedHeading) {
        let fgRectXpath = `//*[@data-testid="hc-block-${chainedHeading}${camelize(objHeading.replace('/', ''))}-progress"]`;
        console.log('foregroundRectXpath =>', fgRectXpath);
        return await $(fgRectXpath)
    },

    getBgRect: async function (objHeading, chainedHeading) {
        let bgRectXpath = `//*[@data-testid="hc-block-${chainedHeading}${camelize(objHeading.replace('/', ''))}-bg"]`;
        console.log('bgRectXpath =>', bgRectXpath);
        return await $(bgRectXpath)
    },

    determinePercentage: async function (objHeading, chainedHeading) {

        let fgRect = await this.getFgRect(objHeading, chainedHeading);
        await fgRect.waitForDisplayed();

        let bgRect = await this.getBgRect(objHeading, chainedHeading);
        await bgRect.waitForDisplayed();

        let fgWidth = await fgRect.getAttribute("width");
        let bgWidth = await bgRect.getAttribute("width");

        return Math.round(fgWidth / bgWidth * 1000) / 10;
    },

    getPillarHeadings: async function () {
        let elems = await $$(`//*[@class="hc-block-utext"]`);
        let headings = await Promise.all(elems.map(async el => {
            await el.isDisplayed();
            return await el.getText();
        }))
        return headings;
    },

    getPillarHeadingsWithChainedHeading: async function (chainedHeading) {
        let xpath = `//*[@class="hc-block-utext" and contains(@data-testid,"${chainedHeading}")]`;
        console.log("getPillarHeadingsWithChainedHeading => ", xpath);
        let elems = await $$(xpath);
        let headings = await Promise.all(elems.map(async el => {
            await el.isDisplayed();
            return await el.getText();
        }))
        return headings;
    },

}