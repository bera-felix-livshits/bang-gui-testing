module.exports = {
    dropDownXPath: `//div[@class="MuiPaper-root MuiPopover-paper MuiPaper-elevation8 MuiPaper-rounded"]`,

    getDisplayedAnalysisPeriodText: async function () {
        let elems = await $$(`//span[contains(text(),"Analysis Period")]/following-sibling::span`);
        console.log(`getDisplayedAnalysisPeriod length => ${elems.length}`)
        return Promise.all(elems.map(async el => {
            await el.waitForDisplayed()
            return await el.getText();
        }))
    },

    setIntervalOrAnalysisPeriodInDropdown: async function (desiredValue) {
        await this.openAnalysisPeriodDropdownIfClosed();
        let elem = await $(`//li[text()="${desiredValue}"]`);
        await elem.click();
        let applyButton = await this.getApplyButton();
        await applyButton.click();
    },

    openAnalysisPeriodDropdownIfClosed: async function () {
        let elem = await $(`${this.dropDownXPath}//span[text()="Interval"]`)
        await elem.waitForDisplayed({ timeout: 1000 })
        let isDisplayed = await elem.isDisplayed();
        if (!isDisplayed) {
            await this.clickAnalysisPeriodDropDown();
        }
    },

    getApplyButton: async function () {
        let xPath = `//span[text()="Apply"]`;
        let elem = await $(xPath);
        await elem.waitForDisplayed();
        return elem;
    },

    getAnalysisPeriodDropdownButton: async function () {
        let xPath = `//span[contains(text(),"Analysis Period")]/following-sibling::button`;
        let elem = await $(xPath);
        await elem.waitForDisplayed();
        return elem;
    },

    clickAnalysisPeriodDropDown: async function () {
        let elem = await this.getAnalysisPeriodDropdownButton()
        await elem.waitForDisplayed();
        await elem.click();
    },

    clickFiltersButton: async function () {
        let filtersButtonXPath = `//button/span[text()="Filters"]`;
        await (await $(filtersButtonXPath)).click();
    },

    clickCloseFiltersButton: async function (){
        let closeFiltersButton = await $(`//span[text()="Filters"]/../following-sibling::div/button`);
        await closeFiltersButton.waitForExist();
        await closeFiltersButton.waitForDisplayed();
        await closeFiltersButton.click();
    },

    getSelectedBrands: async function () {
        await (await $(`//span[contains(@class, "MuiTypography-root") and text()="Filters"]`)).waitForDisplayed();
        let brandsObj = {
            primaryBrand: await (await $(`//span[text()="Primary Brand"]/following-sibling::div//span[contains(@class, "MuiTypography-root")]`))
                .getText(),
            competitiveSet: await Promise.all(await $$(`//span[text()="Competitive Set"]/following-sibling::div//span[contains(@class, "MuiTypography-root")]`)
                .filter(async (el, i) => {
                    if (i % 2 === 0) {
                        return el;
                    }
                })
                .map(async el => {
                    await el.waitForDisplayed();
                    return await el.getText();
                })
            )
        }

        console.log('brands obj =>', brandsObj)
        return brandsObj;
    }


    // => `//div[contains(@class,"sample-size-tooltip")]/div[text()="${brandName}"]`
}