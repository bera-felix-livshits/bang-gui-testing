// const relationshipStage = require('./relationship-stage.js');

module.exports = {
    getPrimaryBrand: async function () {
        let elem = await $(`//div[count(child::span)=2 and count(child::*)=2]/span[1]`)
        await elem.waitForDisplayed();
        return await elem.getText();
    },

    getPrimaryBrandCategory: async function () {
        let elem = await $(`//div[count(child::span)=2 and count(child::*)=2]/span[2]`)
        await elem.waitForDisplayed();
        return await elem.getText();
    },

    generateXPathForSummaryValue: async function (columnHeader, valueHeader, brandEquity) {
        if (!brandEquity[columnHeader]) {
            brandEquity[columnHeader] = {}
        }
        let elem = await $(`//span[text()="${columnHeader}"]//ancestor::div//*[contains(text(),"${valueHeader}")]//following-sibling::div[text()]`);
        let text;
        try {
            await elem.waitForExist();
            text = await elem.getText();
        } catch (e) {
            text = ''
        }
        brandEquity[columnHeader][valueHeader] = text;
    },

    checkingSummaryValues: async function (counter = 0, brandEquity = {}) {
        await this.generateXPathForSummaryValue("Brand Equity", "BERA Score", brandEquity);
        await new Promise(res => {
            setTimeout(() => {
                res()
            }, 1500)
        })
        counter++;
        if (counter < 6 && (brandEquity["Brand Equity"]["BERA Score"] === '–'
            || brandEquity["Brand Equity"]["BERA Score"] === '')) {
            await this.checkingSummaryValues(counter, brandEquity)
        }
    },

    getNumericSummaryValues: async function () {
        let brandEquity = {};

        await this.checkingSummaryValues(0, brandEquity);

        console.log(`\n\nlast value of brandEquity["Brand Equity"]["BERA Score"] => ${brandEquity["Brand Equity"]["BERA Score"]}\n\n`)
        //Brand Equity
        await this.generateXPathForSummaryValue("Brand Equity", "BERA Score", brandEquity)
        await this.generateXPathForSummaryValue("Brand Equity", "Familiarity", brandEquity)
        await this.generateXPathForSummaryValue("Brand Equity", "Regard", brandEquity)
        await this.generateXPathForSummaryValue("Brand Equity", "Meaning", brandEquity)
        await this.generateXPathForSummaryValue("Brand Equity", "Uniqueness", brandEquity)

        //Brand Positioning
        await this.generateXPathForSummaryValue("Brand Positioning", "Purpose", brandEquity)
        await this.generateXPathForSummaryValue("Brand Positioning", "Emotional", brandEquity)
        await this.generateXPathForSummaryValue("Brand Positioning", "Functional", brandEquity)
        await this.generateXPathForSummaryValue("Brand Positioning", "Experiential", brandEquity)

        //Brand Levers
        await this.generateXPathForSummaryValue("Brand Levers", "Product", brandEquity)
        await this.generateXPathForSummaryValue("Brand Levers", "Price", brandEquity)
        await this.generateXPathForSummaryValue("Brand Levers", "Promotion", brandEquity)
        await this.generateXPathForSummaryValue("Brand Levers", "Place", brandEquity)
        await this.generateXPathForSummaryValue("Brand Levers", "People", brandEquity)

        console.log('overview page =>', brandEquity)
        console.log('overview brandEquity["Brand Levers"] =>', Object.keys(brandEquity["Brand Levers"]))
        console.log('overview brandEquity["Brand Levers"]["People"] =>', brandEquity["Brand Levers"]["People"])
        return brandEquity;
    },

    // getBrandEquitySummary: function(){

    // },
    // getBrandPositionSummary: function(){},
    // getBrandLeversSummary: function(){},
    // ...relationshipStage
}

