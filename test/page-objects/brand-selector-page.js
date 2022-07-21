const customClick = require('../utilities/custom-click.js');

module.exports = {
    getAddBrandButtons: async function () {
        let buttonXpath = `//div[@class='bt-brand-row']//button[contains(@class,'MuiButtonBase-root')]`;
        await (await $(buttonXpath)).waitForExist();
        return $$(buttonXpath);
    },

    clickNextButton: async function () {
        await (await $('//span[@class="MuiButton-label" and text()="Next"]')).click();
    },

    getBrandNames: async function (startIndex, endIndex) {
        await (await $(`//div[@class="bt-brand-row-label"]`)).waitForDisplayed();
        let elems = await $$(`//div[@class="bt-brand-row-label"]`);
        
        if(!startIndex && !endIndex){
            startIndex = 0;
            endIndex = elems.length;
        }
        else if (!endIndex) {
            endIndex = startIndex;
            startIndex = 0;
        }

        elems = elems.slice(startIndex, endIndex)
        
        return await Promise.all(elems.map(async el => {
            await el.waitForExist();
            // await el.scrollIntoView();
            let brandName = await el.getText();
            console.log('brand name =>', brandName)
            return brandName;
        }))

    },

    selectFirstFiveBrands: async function () {
        let selectorWindow = await $(`//div[@class="ob-content-left ob-content-padded"]`)
        let brandButtons = await (this.getAddBrandButtons());
        console.log('brand buttons length =>', brandButtons.length);
        for (let i = 0; i < 5; i++) {
            await brandButtons[i].scrollIntoView();
            // await brandButtons[i].click();
            await customClick(brandButtons[i])
            
        }
    }
}