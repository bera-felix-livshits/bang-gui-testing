const customClick = require('../../utilities/custom-click');

module.exports = {
    expandingNavBarXpath: "//a[@id='overview']", //"//div[@data-testid='nav-drawer']",
    headerXpathForMovingFromNavBar: `//div[@id="bera-header-portal"]`,


    generateNavBarXpath: function (textValue) {
        return `//div[@class='MuiListItemText-root']/span[text()='${textValue}']`;
    },

    clickOnNavbarItem: async function (itemName) {
        let nbar = await $(this.expandingNavBarXpath)
        await nbar.waitForDisplayed()
        await (nbar).moveTo();
        customClick(nbar);
        let xpath = this.generateNavBarXpath(itemName);
        await (await $(xpath)).waitForExist({ timeout: 5000 });
        await (await $(xpath)).waitForDisplayed({ timeout: 5000 });
        await (await $(xpath)).click();
        customClick(await $(xpath));
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

    clickMyAudience: async function () {
        await this.clickOnNavbarItem('My Audiences');
    }
}