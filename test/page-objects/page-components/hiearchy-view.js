module.exports = {
    clickConstructBox: async function (constructName) {
        // let el = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-bg"]`);
        let el = await $(`//*[name()="text" and text()="${constructName}"]`);
        await el.waitForDisplayed();
        await el.click();
    },

    getConstructBoxPercentageFill: async function (constructName) {
        let progressRect = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-progress"]`);
        let backgroundRect = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-bg"]`)

        progressRect = await progressRect.getAttribute("width");
        backgroundRect = await backgroundRect.getAttribute("width");

        return Math.round(progressRect / backgroundRect * 1000) / 10;
    },

    isConstructDisplayed: async function (constructName) {
        let el = await $(`//*[name()="text" and text()="${constructName}"]`);
        await el.waitForExist();
        let progressRect = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-progress"]`);
        await progressRect.waitForExist();
        let backgroundRect = await $(`//*[name()="text" and text()="${constructName}"]/preceding-sibling::*[name()="rect" and @class="hc-block-bg"]`)
        await backgroundRect.waitForExist();
        return (await el.isDisplayed() && await progressRect.isDisplayed() && await backgroundRect.isDisplayed());
    },

    getConstructReadMoreElement: async function (constructName) {
        let el = await $(`//*[name()="text" and contains(@data-testid,"${camelize(constructName)}") and text()="Read more"]`);
        await el.waitForDisplayed();
        return el;
    },

    getSubscreenTitle: async function () {
        await new Promise(res => { setTimeout(() => { res(); }, 100) });
        let title = await $(`//div[@id="tabTitle"]/span`);
        return await title.getText();
    },
}