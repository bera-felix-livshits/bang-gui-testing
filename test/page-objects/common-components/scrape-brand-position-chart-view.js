module.exports = {
    scrapeChart: async function () {
        let percentValuesXpath = `//*[@class="recharts-layer recharts-label-list"]//*[string-length(text()) > 0]`;

        let brandTextElements = await $$(`//*[@class="becharts-x-label"]`);
        let brandNames = await Promise.all(brandTextElements.map(async el => await el.getText()));

        let purposeLabel = await $(`//div[@class="becharts-legend-label" and text()="Purpose"]`);
        await purposeLabel.waitForDisplayed()
        await purposeLabel.click();
        await new Promise(res => { setTimeout(() => { res() }, 100); })

        let purposePercentagesElements = await $$(percentValuesXpath)
        let purposePercentages = await Promise.all(purposePercentagesElements.map(async el => await el.getText()));

        let emotionalLabel = await $(`//div[@class="becharts-legend-label" and text()="Emotional"]`);
        await emotionalLabel.waitForDisplayed()
        await emotionalLabel.click();
        await new Promise(res => { setTimeout(() => { res() }, 100); })

        let emotionalPercentagesElements = await $$(percentValuesXpath)
        let emotionalPercentages = await Promise.all(emotionalPercentagesElements.map(async el => await el.getText()));

        let chartValues = brandNames.map((brandName, i) => {
            let dataObj = {};
            if (i === 0) {
                dataObj.primaryBrand = true;
            } else {
                dataObj.primaryBrand = false;
            }

            dataObj.brandName = brandName;
            dataObj.emotionalPercentage = emotionalPercentages[i];
            dataObj.purposePercentage = purposePercentages[i];

            return dataObj
        })

        console.log('!!! chart view values =>', chartValues)

        return chartValues;
    },
}