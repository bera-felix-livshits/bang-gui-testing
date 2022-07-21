module.exports = {
    clickSaveAndFinishButton: async function () {
        (await $(`//button[contains(@class,'MuiButtonBase-root')]/span[text()='Save & Finish']`)).click();
    },

    clickSelectYourAudienceDropdown: async function () {
        (await $("//div[contains(@class,'MuiInputBase-root')]/*[contains(@class,'MuiSelect-icon')]")).click();
    },

    clickAddFilterYourAudience: async function () {
        (await $("//div[contains(@class,'ob-audience-section')]//div[@role='button']/span[contains(@class,'MuiChip-label')]/*[not(@id)]")).click();
    }
}