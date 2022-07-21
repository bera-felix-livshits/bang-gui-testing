const analysisPeriodSelector = require('./common-components/analysis-period-selector.js');
const customClick = require('../utilities/custom-click');
const relationshipMap = require('../page-objects/common-components/relationship-map')

module.exports = {
    getRelationshipStageHeader: async function () {
        let maintXPath = `//*[@id="lc-header-maintain-text" and text()="Maintain"]`;
        let elem = await $(maintXPath);
        await elem.waitForDisplayed({ timeout: 5000 });
        return elem;
    },

    isRelationshipStageVisible: async function () {
        let elem = await this.getRelationshipStageHeader();
        return await elem.isDisplayed();

    },

    clickLoveMapIcon: async function () {
        let elem = await $(`//button[@title="Love map view tooltip text"]`);
        await elem.waitForExist();
        await elem.waitForDisplayed({ timeout: 5000 });
        await customClick(elem)
        // await elem.click();

    },

    clickLoveCurveIcon: async function () {
        await (await $(`//button[@title="Love curve view tooltip text"]`))
            .click();
    },

    

    ...relationshipMap,
    ...analysisPeriodSelector
}