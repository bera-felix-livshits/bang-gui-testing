const customClick = require('../../utilities/custom-click');

module.exports = {
    expandingNavBarXpath: "//a[contains(@class,'MuiListItem-button active')]", //"//div[@data-testid='nav-drawer']",
    headerXpathForMovingFromNavBar: `//div[contains(@class,"MuiToolbar-gutters")]`,


    generateNavBarXpath: function (textValue) {
        return `//span[text()='${textValue}']`;
    },

    clickOnNavbarItem: async function (itemName) {
        let nbar = await $(this.expandingNavBarXpath)
        await nbar.waitForDisplayed({ timeout: 5000, interval: 100 })
        await (nbar).moveTo();
        customClick(nbar);
        let xpath = this.generateNavBarXpath(itemName);

        let els = await $$(xpath);

        let targetEl = (await Promise.all(els.map(async el => {
            await new Promise(res => { setTimeout(() => res(), 100) });
            if (await el.isDisplayed()) {
                return el;
            }
            return null;
        }))).filter(el => el)[0];

        await customClick(targetEl);
        await (await $(this.headerXpathForMovingFromNavBar)).moveTo();
        customClick(this.headerXpathForMovingFromNavBar);

    },

    clickOverview: async function () {
        await this.clickOnNavbarItem('Overview');
    },

    clickRelationshipStage: async function () {
        await this.clickOnNavbarItem('Relationship Stage');
    },

    clickBrandEquity: async function () {
        await this.clickOnNavbarItem('Brand Equity');
    },

    clickBrandPositioning: async function () {
        await this.clickOnNavbarItem('Brand Positioning');
    },

    clickBrandLevers: async function () {
        await this.clickOnNavbarItem('Brand Levers');
    },

    clickAudienceProfile: async function () {
        await this.clickOnNavbarItem('Audience Profiling');
    }
}