module.exports = {
    scrapeAllForPrimaryBrand: async function () {
        let activeButtons = await this.getActiveButtons();
        return await this.scrapePrimaryBrandForAllActiveRows(activeButtons)
    },

    getActiveButtons: async function () {
        let buttonSpanXpath = `//div[@role="button"]/span[contains(@class,"MuiTypography-root")]`;
        let buttonXpath = `//div[@role="button"]/span[contains(@class,"MuiTypography-root")]/..`;
        let buttonsSpanElements = await $$(buttonSpanXpath);
        let buttonElements = await $$(buttonXpath);

        let buttons = await Promise.all(buttonsSpanElements.map(async (buttonEl, i) => {
            // let pointerValue = (await buttonEl.getCSSProperty("pointer-events")).value
            // console.log('value =>', pointerValue)
            // console.log(`i =>`,i)
            // console.log(`await buttonEl.getCSSProperty("border-bottom-color") => `, JSON.stringify(await buttonElements[i].getCSSProperty("border-bottom-color"), null, 4))
            return {
                buttonText: await buttonEl.getText(),
                buttonElement: buttonEl,
                active: (await buttonEl.getCSSProperty("pointer-events")).value == "none" ? false : true,
                selected: (await buttonElements[i].getCSSProperty("border-bottom-color")).value != "rgba(0,0,0,0)" ? true: false
            }
        }));

        buttons = buttons.filter(el => el.active);
        return buttons;
    },

    scrapePrimaryBrandForAllActiveRows: async function (buttons, populatedObj = {}) {
        //do this recursively
        let copiedButtons = [...buttons];
        if (copiedButtons.length > 0) {
            let firstButton = copiedButtons[0]
            copiedButtons = copiedButtons.slice(1);

            await firstButton.buttonElement.click();
            let rowHeaderValues = await this.scrapePrimaryBrandDisplayedRow();
            console.log("rowHeaderValues =>", rowHeaderValues);
            populatedObj[firstButton.buttonText] = { ...rowHeaderValues };
            populatedObj = await this.scrapePrimaryBrandForAllActiveRows(copiedButtons, populatedObj)

        }
        console.log("copiedButtons =>", copiedButtons.length)
        return populatedObj
    },

    scrapePrimaryBrandDisplayedRow: async function () {
        let rowOneXpath = `//tbody/tr[1]/td`;
        let headersXpath = `//thead/tr/th/div/div[string-length(text()) > 0]`;

        let rowHeaderValueElements = await $$(headersXpath);
        let rowHeaderValues = await Promise.all(rowHeaderValueElements.map(async (headerEl, i) => {
            return await headerEl.getText();
        }))

        let primaryBrand = await (await $(`//tbody/tr[1]/td//div[text()][1]`)).getText();
        let primaryBrandValueElements = await $$(`//tbody/tr[1]/td[@role="cell" and not(descendant::*)]`);

        let primaryBrandValues = await Promise.all(primaryBrandValueElements.map(async el => {
            return await el.getText();
        }))

        let retObj = {
            brand: primaryBrand,
            values: {}
        }

        rowHeaderValues.forEach((el, i) => {
            retObj.values[el] = primaryBrandValues[i]

        })
        return retObj;
    }
}