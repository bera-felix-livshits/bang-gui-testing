const customClick = require('../utilities/custom-click.js');

module.exports = {
    clickSaveAndFinishButton: async function () {
        (await $(`//button[contains(@class,'MuiButtonBase-root')]/span[text()='Save & Finish']`)).click();
    },

    clickSelectYourAudienceDropdown: async function () {
        let elem = await $("//div[contains(@class,'MuiInputBase-root')]/*[contains(@class,'MuiSelect-icon')]/..");
        await elem.waitForDisplayed();
        await elem.click();
    },

    selectYourAudienceByValue: async function (audienceName) {
        await this.clickSelectYourAudienceDropdown();
        let inputElem = await $(`//input[@type="search"]`);
        await inputElem.isExisting();
        await inputElem.isDisplayed();
        await inputElem.setValue(audienceName)
        await (await $(`//div[contains(text(),"${audienceName}")]`)).click()
    },

    clickAddFilterYourAudience: async function () {
        (await $("//div[contains(@class,'ob-audience-section')]//div[@role='button']/span[contains(@class,'MuiChip-label')]/*[not(@id)]")).click();
    },

    selectFilterOptions: async function (...args) {
        // `//span[text()="Excellent (800 or higher)"]/preceding-sibling::span[position()=0 and @class="MuiIconButton-label"]`
        await Promise.all(args.map(async (arg, i) => {
            // if (i >= 2) {
                let elem = await $(`//span[text()="${arg}"]/preceding-sibling::span/span[@class="MuiIconButton-label"]`);
                await elem.waitForExist();
                await elem.waitForDisplayed();
                await elem.click();
                return true;
            // }
            return false;
        }))
    },

    clickApplyFilterButton: async function () {
        let elem = $(`//div[@id="options-popover"]//span[text()="Apply"]`);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        await elem.click();
    },

    insertNameForAudience: async function (audienceName) {
        let elem = $(`//div[text()="Name your new audience"]/../following-sibling::div[@class="ob-audience-section"]//input[@type="text"]`);
        await elem.waitForExist();
        await elem.waitForDisplayed();
        await elem.setValue(audienceName + ' ' + (Date.now()));
    }
}