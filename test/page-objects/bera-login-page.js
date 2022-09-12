module.exports = {
    getEmailInput: function () {
        return $("//input[@name='usernameUserInput']")
    },

    getContinueButton: function () {
        return $("//input[@value='Continue']");
    },

    getPasswordInput: function () {
        return $("//input[@type='password']")
    },

    get2ndContinueButton: function () {
        return $("//button[contains(text(),'Continue')]");
    },

    selectDataSet: async function (desiredDataSet) {
        let dataSetDiv = await $(`//div[text()="Dataset"]/following-sibling::div`);
        await dataSetDiv.waitForDisplayed();
        await dataSetDiv.click();

        let inputBox = await $(`//div[@role="option"]//input[@type="search"]`)
        await inputBox.waitForDisplayed()
        await inputBox.setValue(desiredDataSet)

        let option = await $(`//li[@role="option"]`)
        await option.waitForDisplayed();
        await option.click();

    },

    login: async function () {
        const user = process.env.USER_EMAIL;
        const pw = process.env.USER_PW;
        console.log('user =>', user)
        console.log('pw =>', pw)
        browser.url('/');

        await (await this.getEmailInput()).setValue(user);
        await (await this.getContinueButton()).click();
        await (await this.getPasswordInput()).setValue(pw);
        await (await this.get2ndContinueButton()).click();
    }
}
