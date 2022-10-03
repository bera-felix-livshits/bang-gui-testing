const customClick = require("../../utilities/custom-click.js");
const customClearValue = require("../../utilities/custom-clearValue.js");

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
        let elem = await $(`${this.dropDownXPath}//span[text()="Analysis Period"]`)
        await elem.waitForDisplayed({ timeout: 1000 })
        let isDisplayed = await elem.isDisplayed();
        if (!isDisplayed) {
            await this.clickAnalysisPeriodDropDown();
        }
    },

    getApplyButton: async function () {
        let xPath = `//span[text()="Apply"]/..`;
        let elem = await $(xPath);
        await elem.waitForDisplayed();
        await elem.waitForClickable();
        await new Promise(res => setTimeout(() => res(), 100));
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

    getAnalysisPeriod: async function () {
        let periods = await $$(`//span[text()="Analysis Period"]/following-sibling::span[text()]`);
        return await Promise.all(periods.map(async el => {
            await el.waitForDisplayed({timeout:10000, interval:100})
            return await el.getText();
        }))
    },

    clickFiltersButton: async function () {
        await new Promise(res => { setTimeout(() => { res() }, 250); })
        let filtersButtonXPath = `//button/span[text()="Filters"]`;
        let elem = await $(filtersButtonXPath);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        await elem.click();
        await new Promise(res => setTimeout(() => { res() }, 100))
    },

    clickCloseFiltersButton: async function () {
        await new Promise(res => { setTimeout(() => { res() }, 250); })
        let closeFiltersButton = await $(`//span[text()="Filters"]/../following-sibling::div/button`);
        await closeFiltersButton.waitForExist();
        await closeFiltersButton.waitForDisplayed({ timeout: 5000, interval: 100 });
        await closeFiltersButton.click();
        await closeFiltersButton.waitForDisplayed({ timeout: 5000, interval: 100, reverse: true });
        await new Promise(res => setTimeout(() => { res() }, 100))
    },

    getSelectedBrands: async function () {
        // await new Promise(res => { setTimeout(() => { res() }, 250); })

        let primaryBrandEl = await $(`//span[text()="Primary Brand"]/../../following-sibling::div//span[text()][1]`);
        await primaryBrandEl.waitForDisplayed({ timeout: 10000, interval: 100 });
        let compentitiveSetEls = await $$(`//span[text()="Competitive Set"]/../../following-sibling::div//span[text()][1]`);
        // await new Promise(res => setTimeout(() => { res() }, 100))
        let brandsObj = {
            primaryBrand: await primaryBrandEl.getText(),
            competitiveSet: await Promise.all(
                compentitiveSetEls
                    .map(async el => {
                        await el.waitForDisplayed({ timeout: 10000, interval: 100 });
                        return await el.getText();
                    })
            )
        }

        console.log('brands obj =>', brandsObj)
        return brandsObj;
    },

    clickAddFilterToYourAudienceButton: async function () {
        let elem = await $(`//div[text()="Filter your audience"]/../following-sibling::div[position()=1 and @class="ob-audience-section"]//div[@role="button"]`);
        await elem.waitForExist();
        await elem.waitForClickable();
        await elem.click();
    },

    selectFilter: async function (filterName) {
        // `//div[@role="button"]//span[text()="Credit Score"]`
        await new Promise(res => {
            setTimeout(() => {
                res()
            }, 500);
        })
        let elem = await $(`//div[@role="button"]//span[text()="${filterName}"]`);
        await elem.waitForExist();
        await elem.waitForClickable();
        await elem.click();
    },

    isPrimaryAudienceDisplays: async function (audienceName) {
        let elem = $(`//span[contains(text(),"${audienceName}")]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    clickEditPrimaryAudienceButton: async function () {
        let elem = await $(`//span[text()="Primary Audience"]/../following-sibling::div//span[text()="Edit"]`);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        await customClick(elem)
    },

    // clickEditBrandsButton: async function () {
    //     let elem = await $(`//span[text()="Brands"]/../following-sibling::div//span[text()="Edit"]`);
    //     await elem.waitForExist();
    //     await elem.waitForDisplayed();
    //     await customClick(elem)
    // },

    clickSelectYourAudienceDropdown: async function () {
        let elem = await $(`//span[text()="Audience"]/../../following-sibling::div//div[contains(@class, "MuiOutlinedInput-input")]`);
        // let elem = await $("//div[contains(@class,'MuiInputBase-root')]/*[contains(@class,'MuiSelect-icon')]/..");
        await elem.waitForClickable({ timeout: 5000, interval: 100 });
        await elem.click();
    },

    selectYourAudienceByValue: async function (audienceName) {
        await this.clickSelectYourAudienceDropdown();
        let inputElem = await $(`//input[@type="search" and @placeholder="Find audience..."]`);

        await inputElem.waitForClickable({ timeout: 5000, interval: 100 });
        await inputElem.setValue(audienceName)
        await (await $(`//div[contains(text(),"${audienceName}")]`)).click()
    },

    getSelectedAudience: async function () {
        let textEl = await $(`//span[text()="Audience"]/../../following-sibling::div//input/preceding-sibling::div/div[text()]`);
        await textEl.waitForDisplayed({ timeout: 10000, interval: 100 });
        return await textEl.getText();
    },

    //// Brand Manipulation
    selectDataSet: async function (desiredDataSet) {
        let dataSetDiv = await $(`//div[text()="Dataset"]/following-sibling::div`);
        await dataSetDiv.waitForDisplayed();
        await dataSetDiv.click();

        await new Promise(res => setTimeout(() => res(), 100));

        let inputBox = await $(`//div[@role="option"]//input[@type="search"]`)
        await inputBox.waitForDisplayed()
        await inputBox.setValue(desiredDataSet)

        await new Promise(res => setTimeout(() => res(), 100));

        let option = await $(`//li[@role="option"]/div[contains(text(), "${desiredDataSet}")]`)
        await option.waitForDisplayed();
        await option.click();

        await new Promise(res => setTimeout(() => res(), 100));
    },

    getSelectedDataSet: async function (){
        let dataSet = await $(`//div[text()="Dataset"]/following-sibling::div//div[@role="button"]/div[text()]`);
        await dataSet.waitForDisplayed({timeout:10000, interval:100});
        return await dataSet.getText();
    },


    getSearchInputBox: async function () {
        let brandInputSearchEl = await $(`//input[@type="search" and @placeholder="Find brand..."]`)
        return brandInputSearchEl;
    },

    addPrimaryBrand: async function (brandName) {
        await new Promise(res => {
            setTimeout(() => {
                res()
            }, 100)
        })
        let primaryBrandDropDown = await $(`//span[text()="Primary Brand"]/../../following-sibling::div//button[text()="Select brand"]`);
        await primaryBrandDropDown.waitForDisplayed();
        await primaryBrandDropDown.click();
        let searchInputBox = await this.getSearchInputBox();
        await searchInputBox.waitForDisplayed()
        await customClearValue(searchInputBox)
        await searchInputBox.setValue(brandName);
        let brandEntry = await $(`//div[text()="${brandName}"]`)
        await brandEntry.waitForDisplayed();
        await brandEntry.click();
        await browser.keys("\uE00C");
        await searchInputBox.waitForDisplayed({ reverse: true, timeout: 5000, interval: 100 });
    },

    addCompetitiveSetBrands: async function (brandsArr) {
        let searchInputBox = await this.getSearchInputBox();
        if (brandsArr.length > 0) {

            if (!(await searchInputBox.isDisplayed())) {
                let competitiveSetDropDown = await $(`//span[text()="Competitive Set"]/../../following-sibling::div//button[text()="Select brand"]`);
                await competitiveSetDropDown.waitForDisplayed();
                await competitiveSetDropDown.click();
                await searchInputBox.waitForDisplayed();
            }

            let brandName = brandsArr[0];
            brandsArr = brandsArr.slice(1);

            await customClearValue(searchInputBox)
            await searchInputBox.setValue(brandName);
            let brandEntry = await $(`//div[text()="${brandName}"]`)
            await brandEntry.waitForDisplayed();
            await brandEntry.click();
            await this.addCompetitiveSetBrands(brandsArr);
        } else {
            await browser.keys("\uE00C");
            await searchInputBox.waitForDisplayed({ reverse: true, timeout: 5000, interval: 100 });
        }
    },

    removeBrandFromCompetitiveSet: async function (brandName) {
        let closeButton = await $(`//span[text()="${brandName}"]/../following-sibling::div/button[@data-testid="close-button"]`);
        await closeButton.waitForDisplayed({ timeout: 10000, interval: 100 });
        await closeButton.click();
    },

    removeAllFromCompetitiveSet: async function () {
        let buttonEl = await $(`//button/span[text()="Clear"]/..`);
        await buttonEl.waitForDisplayed({ timeout: 5000, interval: 100 });
        await buttonEl.waitForClickable({ timeout: 5000, interval: 100 });
        await buttonEl.click()
    }
}