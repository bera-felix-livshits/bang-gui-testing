const customClick = require('../utilities/custom-click.js');
const customClearValue = require('../utilities/custom-clearValue.js');

module.exports = {
    getSearchInput: async function () {
        let searchInput = await $(`//input[@id="brandscape-search"]`);
        await searchInput.waitForExist();
        await searchInput.waitForDisplayed();
        return searchInput;
    },

    getAddBrandButtons: async function () {
        let buttonXpath = `//div[@class='bt-brand-row']//button[contains(@class,'MuiButtonBase-root')]`;
        await (await $(buttonXpath)).waitForExist();
        return $$(buttonXpath);
    },

    clickNextButton: async function () {
        await (await $('//span[@class="MuiButton-label" and text()="Next"]')).click();
    },

    getAvailableBrandNames: async function (startIndex, endIndex) {
        await (await $(`//div[@class="bt-brand-row-label"]`)).waitForDisplayed();
        let elems = await $$(`//div[@class="bt-brand-row-label"]`);

        if (!startIndex && !endIndex) {
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
        await this.selectFirstNButtons(5);
    },

    selectFirstNButtons: async function (n) {
        let brandButtons = await (this.getAddBrandButtons());
        console.log('brand buttons length =>', brandButtons.length);
        for (let i = 0; i < n; i++) {
            await brandButtons[i].scrollIntoView();
            await customClick(brandButtons[i])
        }
    },

    addFirstBrand: async function () {
        let brandButtons = await (this.getAddBrandButtons());
        await new Promise(res => {
            res(customClick(brandButtons[0]))
        });
    },

    selectSpecificBrand: async function (searchValue) {
        let searchInput = await this.getSearchInput();
        await searchInput.setValue(searchValue);
        await this.addFirstBrand();
        await customClearValue(searchInput);
        await new Promise(res => {
            setTimeout(()=>{
                res();
            },1000)
        })
    },

    getSelectedBrands: async function (){
        let xPath = `//div[@class="ob-content-right"]//div[@class="bt-drag-box"]//img[@alt]`;
        await $(xPath).waitForExist();
        await $(xPath).waitForDisplayed();
        let selectedBrandsElements = await $$(xPath);
        
        console.log(`selected brands length => ${selectedBrandsElements.length}`)
        let selectedBrands = await Promise.all(selectedBrandsElements.map(async el => {
            let alt = await el.getAttribute("alt");
            console.log('alt value =>', alt)
            return alt;
        }));

        console.log('!@! Selected Brands =>', selectedBrands);
        return selectedBrands;
    }
}