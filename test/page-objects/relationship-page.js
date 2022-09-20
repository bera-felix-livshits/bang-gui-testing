const analysisPeriodSelector = require('./page-components/analysis-period-selector-and-filters.js');
const customClick = require('../utilities/custom-click');
const relationshipMap = require('./page-components/relationship-map');
const { selectFilterOptions, clickApplyFilterButton, insertNameForAudience, clickSaveAndFinishButton } = require('./audience-details-page.js');

module.exports = {
    getRelationshipStageHeader: async function () {
        let maintXPath = `//main//span[contains(@class, "MuiTypography-root") and text()="Relationship Stage"]`;
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
        await customClick(elem);
        await new Promise (res => {
            setTimeout(()=>{
                res();
            },1500)
        })
        // await elem.click();

    },

    clickLoveCurveIcon: async function () {
        await (await $(`//button[@title="Love curve view tooltip text"]`))
            .click();
    },


    createAndSelectPrimaryAudience: async function (...args) {
        console.log('!!! ARGS =>', args);
        await this.selectFilter(args[0]);
        let filterOpts = args.slice(1)
        console.log('filterOpts =>', filterOpts)
        await selectFilterOptions(filterOpts);

        // Use for negative tests - no sample available with first five brands.
        // await relationshipStage.selectFilter("Test sample", "Credit Score","Very good (740-799)", "Good (670-739)");
        // await audienceDetailsPage.selectFilterOptions("Test sample", "Credit Score","Very good (740-799)", "Good (670-739)");
        // Unable to save your audience (check console)

        await clickApplyFilterButton();
        // await insertNameForAudience(args[0])
        // await clickSaveAndFinishButton();
    },

    clickCancelNewSelectionButton: async function () {
        let elem = await $(`//div[@data-testid="selection-details-popover-content"]//span[text()="Cancel"]`);
        await elem.waitForExist();
        await elem.waitForDisplayed({ timeout: 5000 });
        await elem.click();

        elem = await $(`//div[@data-testid="selection-popover-content"]//button[@tabindex="0"]`)
        await elem.waitForExist();
        await elem.waitForDisplayed({ timeout: 5000 });
        await elem.click();
    },

    ...relationshipMap,
    ...analysisPeriodSelector,


}