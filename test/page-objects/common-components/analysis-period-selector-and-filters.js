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

    setIntervalOrAnalysisPeriodInDropdownCustomForYear: async function (fromDate, toDate) {
        let customElem = await $(`//li[text()="Custom"]`);
        await customElem.isExisting();
        await customElem.isDisplayed();
        await customElem.click();

        let leftBoxPrefixXPath = `//div[@class="bp-panel bp-starter"]`; //left outer box
        let rightBoxPrefixXPath = `//div[@class="bp-panel bp-ender"]`; //right outer box
        await this.setYearValue(leftBoxPrefixXPath, fromDate)
        await this.setYearValue(rightBoxPrefixXPath, toDate)

        await (await this.getApplyButton()).click();
    },

    setYearValue: async function (outerBoxXpath, date) {
        let buttonDecadeLeftXPath = `//button[@class="bp-header-super-prev-btn"]`; //left button
        let buttonDecadeRightXPath = `//button[@class="bp-header-super-next-btn"]`; //right button
        let buttonDecadeRangeXPath = `//button[@class="bp-decade-btn"]`; // => use this to get the text for date range
        let innerCell = `//div[@class="bp-cell-inner"]`;

        let yearElems = await $$(outerBoxXpath + innerCell);
        let textContentOfElems = await Promise.all(yearElems.map(async el => {
            return await el.getText()
        }))

        console.log(`textContentOfElems => ${textContentOfElems}`)

        if (parseInt(date) > parseInt(textContentOfElems[textContentOfElems.length - 1])) {
            await (await $(outerBoxXpath + buttonDecadeLeftXPath)).click();
            await this.setYearValue((outerBoxXpath, date));
        }

        if (parseInt(date) < parseInt(textContentOfElems[0])) {
            await (await $(outerBoxXpath + buttonDecadeRightXPath)).click();
            await this.setYearValue((outerBoxXpath, date));
        }

        let targetEl = await $(`${outerBoxXpath}//div[@class="bp-cell-inner" and text()="${date}"]`)
        await targetEl.isDisplayed();
        await targetEl.click();

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
        let elem = await $(filtersButtonXPath);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        await elem.click();
    },

    clickCloseFiltersButton: async function () {
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
    },

    clickPrimaryAudienceEditButton: async function () {
        let elem = await $(`//div/span[text()="Primary Audience"]/../following-sibling::div[position()=1]//span[text()="Edit"]`);
        await elem.waitForExist();
        await elem.waitForClickable();
        await elem.click();
    },

    clickBrandsEditButton: async function () {
        let elem = await $(`//span[text()="Brands"]/../following-sibling::div[position()="1"]//span[text()="Edit"]`);
        await elem.waitForExist();
        await elem.waitForClickable();
        await elem.click();
    },

    clickAddFilterToYourAudienceButton: async function () {
        let elem = await $(`//div[text()="Filter your audience"]/../following-sibling::div[position()=1 and @class="ob-audience-section"]//div[@role="button"]`);
        await elem.waitForExist();
        await elem.waitForClickable();
        await elem.click();
    },

    selectFilter: async function (filterName) {
        // `//div[@role="button"]//span[text()="Credit Score"]`
        let elem = await $(`//div[@role="button"]//span[text()="${filterName}"]`);
        await elem.waitForExist();
        await elem.waitForClickable();
        await elem.click();
    },

    isPrimaryAudienceDisplays: async function (audienceName) {
        let elem = $(`//span[contains(text(),"${audienceName}")]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    }

    // => `//div[contains(@class,"sample-size-tooltip")]/div[text()="${brandName}"]`

}