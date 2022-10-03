const fs = require('fs');

module.exports = {
    getTable: async function () {
        let tableHeaders = await this.getTableHeaders();
        let tableContents = await this.getTableContents(tableHeaders);

        // fs.writeFileSync('./zzz.table-contents.json', JSON.stringify(tableContents, null, 4))
        return {
            tableHeaders,
            tableContents
        }

    },

    getTableHeaders: async function (dataObj = {}, headerEls = null) {
        if (Object.keys(dataObj).length === 0 && !headerEls) {
            headerEls = await $$(`//th/div/div[text()]`);
            await Promise.all(headerEls.map(async el => {
                await el.waitForDisplayed({ timeout: 10000, interval: 100 });
            }))
        }

        if (headerEls && headerEls.length > 0) {
            let targetEl = headerEls[0];
            headerEls = headerEls.slice(1);

            await targetEl.waitForDisplayed({ timeout: 10000, interval: 100 });
            let segmentName = await targetEl.getText();
            console.log("segment name => ", segmentName)
            dataObj[segmentName] = {
                color: await targetEl.getCSSProperty('color'),
                filterEl: await $(`//th/div/div[text()="${segmentName}"]/following-sibling::span[@role="button"]`)
            }

            dataObj = await this.getTableHeaders(dataObj, headerEls);
        }

        return dataObj;
    },

    getTableContents: async function (tableHeaders, dataObj = {}, tableRowsCount = null, tableRowsIndex = 1, lastDemoGroup = null) {
        if (tableRowsCount === null) {
            let trs = await $$(`//tbody//tr`);
            await Promise.all(trs.map(async row => await row.waitForDisplayed({ timeout: 10000, interval: 100 })));
            tableRowsCount = trs.length;
        }

        console.log(`total rows : ${tableRowsCount}`)

        let trHeader = await (await $(`//tbody//tr[${tableRowsIndex}]/td/div[contains(@class,"data-cell")]`)).getText();
        let trPercentageValues = await $$(`//tbody//tr[${tableRowsIndex}]//span[@class="ap-ct-data"]`)
        let trIndexValues = await $$(`//tbody//tr[${tableRowsIndex}]//span[@class="index-value"]`)

        console.log("trPercentageValues.length =>", trPercentageValues.length)
        console.log(`trHeader => ${trHeader}`)
        if(trPercentageValues.length === 0){
            lastDemoGroup = trHeader;
            dataObj[lastDemoGroup] = {};
        } else {
            console.log('!! last demo group =>', lastDemoGroup)
            console.log(`!! trHeader => ${trHeader}`)
            dataObj[lastDemoGroup][trHeader]= { };
            let segmentValues = Object.keys(tableHeaders);

            console.log("trPercentageValues.length => ", trPercentageValues.length)

            await Promise.all(trPercentageValues.map(async (_, i) => {
                dataObj[lastDemoGroup][trHeader][segmentValues[i]] = {
                    percentageValue: await trPercentageValues[i].getText(),
                    indexValue: await trIndexValues[i].getText()
                }
            }))
        }
        if (tableRowsIndex < tableRowsCount){
            tableRowsIndex++;
            dataObj = await this.getTableContents(tableHeaders, dataObj, tableRowsCount, tableRowsIndex, lastDemoGroup)
        }
        return dataObj;

    }
}