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

    clickSaveButton: async function () {
        await (await $('//span[@class="MuiButton-label" and text()="Save"]')).click();
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
        await this.selectFirstNBrands(5);
    },

    selectFirstNBrands: async function (n) {
        let brandButtons = await (this.getAddBrandButtons());
        console.log('brand buttons length =>', brandButtons.length);
        for (let i = 0; i < n; i++) {
            await brandButtons[i].scrollIntoView();
            await customClick(brandButtons[i])
        }
    },

    addFirstBrand: async function () {
        let brandButtons = await (this.getAddBrandButtons());
        await brandButtons[0].isClickable();
        await brandButtons[0].click();
    },

    selectSpecificBrand: async function (searchValue) {
        let searchInput = await this.getSearchInput();
        await searchInput.setValue(searchValue);

        await new Promise(res => {
            setTimeout(() => {
                res();
            }, 500)
        })

        let elem = await $(`//div[@class="bt-brand-row"]/div[@class="bt-brand-row-label" and text()="${searchValue}"]/../div[@class="bt-brand-row-button"]`);
        await elem.isClickable();
        await elem.click();

        await customClearValue(searchInput);
    },

    getSelectedBrands: async function () {
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

        return selectedBrands;
    },

    removePrimaryBrand: async function () {
        let elem = await $(`//span[text()="Primary Brand"]/../following-sibling::div[position()="1"]//button`);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        await elem.click();
    },

    removeCompentitiveSet: async function () {
        let elem = await $(`//span[text()="Competitive Set"]/../following-sibling::div//button`);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        await elem.click();
    },

    removeAllFromCompetitiveSet: async function () {
        let elem = await $(`//span[text()="Remove All"]`);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        await elem.click();
    },

    isPrimaryBrandElementDisplayed: async function () {
        let elem = await $(`//div[@data-rbd-droppable-id="primary"]`);
        try {
            await elem.waitForExist({ timeout: 5000 });
        } catch (e) {
            return false;
        }
        await elem.waitForDisplayed();
        return elem.isDisplayed();
    },

    isCompentitiveSetElementsDisplayed: async function () {
        let elems = await $$(`//div[@data-rbd-droppable-id="Competitive Set"]`);
        elems = await Promise.all(res => {
            res(elems.map(async el => {
                await el.waitForDisplayed();
                return el;
            }))
        })

        if (elems.length > 0) {
            return true;
        }
        return false;
    },

    getPrimaryBrandElement: async function () {
        let elem = await $(`//div[@data-rbd-droppable-id="primary"]`);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        return elem;
    },

    getCompetitiveSetElements: async function () {
        await new Promise(res => {
            setTimeout(() => {
                res()
            }, 500)
        })
        let elems = await $$(`//div[@data-rbd-droppable-id="competitive"]/div`);
        return await Promise.all(
            elems.map(async el => {
                await el.waitForDisplayed();
                return el;
            })
        )
    },

}