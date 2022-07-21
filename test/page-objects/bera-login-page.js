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
