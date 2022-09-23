const fs = require('fs');

module.exports = {
    getAllChartEntryElements: async function () {
        await new Promise(res => { setTimeout(() => { res() }, 100); })
        let elems = await $$(`//*[@class="recharts-layer recharts-bar"]//*[@name]`);
        await Promise.all(elems.map(async el => {
            await el.waitForDisplayed();
        }))

        return elems;
    },

    scrapeChart: async function () {

        let constructButtons = await $$(`//div[@role="button"]/span[string-length(text()) > 0]`)
        let validConstructButtons = await Promise.all(constructButtons.map(async button => {
            if (await button.isClickable()) {
                return button;
            }
            return null;
        }))
        validConstructButtons = validConstructButtons.filter(el => el);
        let names = await Promise.all(validConstructButtons.map(async button => {
            return await button.getText();
        }))


        return await this.getChartLevels(names)
    },

    getChartLevels: async function (names, index = 0, chartsObj = {}) {
        let name = names[index];
        await $(`//div[@role="button"]/span[text()="${name}"]`).click()
        let xAxisEntries = await $$(`//div[@data-bar]`);
        let xAxisEntryNames = await Promise.all(xAxisEntries.map(async el => await el.getAttribute('data-bar')));
        let levelEntries = await this.getChartLevelEntries(xAxisEntryNames)
        chartsObj[name] = levelEntries;

        index++;
        if (index < names.length) {
            await new Promise(res => { setTimeout(() => { res() }, 100); })
            chartsObj = await this.getChartLevels(names, index, chartsObj)
        }

        return chartsObj;
    },

    getChartLevelEntries: async function (entryNames, index = 0, entriesDataObj = {}) {
        let entryName = entryNames[index];
        let targetDataBar = await $(`//div[@data-bar="${entryName}"]//div[@class="becharts-legend-label"]`);
        let brands = await Promise.all((await $$(`//*[name()="text" and @class="becharts-x-label"]`))
            .map(async el => await el.getText()))
        let entryNameKey = await $(`//div[@data-bar="${entryName}"]//div[@class="becharts-legend-label"]`).getText();

        await targetDataBar.waitForDisplayed();
        await targetDataBar.click();
        await new Promise(res => { setTimeout(() => { res() }, 100); })

        let entryNameValueEls = await $$(`//*[@class="recharts-layer recharts-label-list"]//*[name()="text"]`);
        entryNameValueEls.map(async entryNameValueEl => await entryNameValueEl.waitForDisplayed({ timeout: 10000, interval: 100 }));
        let entryNameValues = await Promise.all(entryNameValueEls.map(async el => await el.getText()));

        let colourElements = await $$(`//*[@class="recharts-layer recharts-bar"]//*[@name="${entryName}"]`);
        let colourValues = await Promise.all(colourElements.map(async el => await el.getCSSProperty('fill')))

        entriesDataObj[entryNameKey] = {}
        brands.forEach((brand, i) => {
            brandDataObj = {};
            i === 0 ? brandDataObj.primaryBrand = true : brandDataObj.primaryBrand = false;
            brandDataObj.percentage = entryNameValues[i];
            brandDataObj.colour = colourValues[i];
            entriesDataObj[entryNameKey][brand] = brandDataObj;
        });

        index++;
        if (index < entryNames.length) {
            entriesDataObj = await this.getChartLevelEntries(entryNames, index, entriesDataObj);
        }

        return entriesDataObj;
    }
}