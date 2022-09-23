const waitForLoadingToComplete = require("./wait-for-loading-to-complete.js");
const camelize = require("../../utilities/camelize")
module.exports = {
    // DNA subsection

    clickPurposeButton: async function () {
        let elem = await $(`//div[@role="button"]/span[text()="Purpose"]`);
        await elem.waitForDisplayed();
        await elem.click();
    },

    clickEmotionalButton: async function () {
        let elem = await $(`//div[@role="button"]/span[text()="Emotional"]`);
        await elem.waitForDisplayed();
        await elem.click();
        await new Promise(res => { setTimeout(() => { res() }, 100) });
    },

    getQuadrant: async function (desiredQuadrant) {
        await new Promise(res => { setTimeout(() => { res(); }, 100) });
        let xPath = `//*[name()="g" and @data-testid="qc-quadrant-${desiredQuadrant}"]/*[name()="rect"]`;
        let quad = await $(xPath);
        await quad.waitForDisplayed()
        return quad;
    },

    getQuadrantPercentageOfQuadrant: async function (desiredQuadrant) {
        let bg = await $(`//*[name()="rect" and @data-testid="qc-purpose-bg"]`);
        let bgSize = await bg.getSize();

        await new Promise(res => { setTimeout(() => { res() }, 800); })

        let targetQuadrant = $(`//*[name()="g" and @data-testid="qc-quadrant-${desiredQuadrant}"]/*[name()="rect"]`);
        let tqSize = await targetQuadrant.getSize();

        let widthPercentage = tqSize.width / bgSize.width;
        let heightPercentage = tqSize.height / bgSize.height;

        return {
            widthPercentage,
            heightPercentage
        }
    },

    getQuadrantsChartBackgroundColor: async function () {
        await new Promise(res => { setTimeout(() => { res(); }, 100) });
        return (await (await $(`//*[@class="qc-background-border"]`)).getCSSProperty('stroke')).value;
    },

    getErrorBannerContents: async function () {
        await new Promise(res => { setTimeout(() => { res(); }, 500) });
        let errorIcon = await $(`//div[@class="MuiAlert-icon"]`)
        let errorMessage = await $(`//div[@class="MuiAlert-message"]`)
        if (await errorIcon.isExisting() && await errorMessage.isExisting() && await errorMessage.isDisplayed()) {
            return {
                errorIconDisplayed: await errorIcon.isDisplayed(),
                errorMessage: await errorMessage.getText(),
                errorFiltersLink: await $(`//div[@class="MuiAlert-action"]//span[text()="Open Filters"]/..`)
            }
        }
        return {
            errorIconDisplayed: false,
            errorMessage: "",
            errorFiltersLink: null,
        }
    },

    getQuadrantAreaDescription: async function () {
        let textAreaEl = await $(`//div[@class="bera-quadrant-accessories"]//span[text()="Area Description"]/following-sibling::span`);
        // await new Promise(res => { setTimeout(() => { res(); }, 100); })
        await textAreaEl.waitForDisplayed()
        return await textAreaEl.getText();
    },


    getActiveQuadrantDescription: async function () {
        let quadDescriptionsEls = await $$(`//*[name()="g" and @class="qc-description"]/*[name()="text"]`);
        let quadDescEl = (await Promise.all(quadDescriptionsEls.map(async el => {
            try {
                await new Promise(res => { setTimeout(() => { res(); }, 250); })
                await el.waitForDisplayed({ timeout: 250 })
            } catch (e) { }
            return (await el.isDisplayed()) ? el : null;;
        }))).find(el => el);

        let desc = quadDescEl ? await quadDescEl.getText() : '';
        return desc;
    },

    getQuadrantPointComponents: async function (desiredEntry) {
        await new Promise(res => {
            setTimeout(() => {
                res()
            }, 250)
        })

        let rect = await $(`//*[name()="g" and @id="qc-point-${camelize(desiredEntry)}"]/*[name()="rect"]`)
        let text = await $(`//*[name()="g" and @id="qc-point-${camelize(desiredEntry)}"]/*[name()="text"]`)
        let circle = await $(`//*[name()="g" and @id="qc-point-${camelize(desiredEntry)}"]/*[name()="circle"]`)

        return {
            rect,
            text,
            circle
        }
    },

    getQuadrantUpdateComponents: async function (desiredQuadrant) {
        let el = await this.getQuadrant(desiredQuadrant)
        await el.moveTo();
        await new Promise(res => setTimeout(() => res(), 100));

        let colour = await (await $(`//*[name()="g" and @data-testid="qc-quadrant-${desiredQuadrant}"]/*[name()="g" and @class="qc-description"]/*[name()="rect"]`)).getCSSProperty('fill');
        let text = await (await $(`//*[name()="g" and @data-testid="qc-quadrant-${desiredQuadrant}"]/*[name()="g" and @class="qc-description"]/*[name()="text"]`)).getText();

        return {
            colour,
            text
        }
    },

    getAllQuadrantPoints: async function () {
        await waitForLoadingToComplete()
        await new Promise(res => setTimeout(() => { res() }, 100));
        let els = await $$(`//*[name()="g" and contains(@id,"qc-point-")]`);
        let textEls = await $$(`//*[name()="g" and contains(@id,"qc-point-")]/*[name()="text"]`);
        return Promise.all(els.map(async (el, i) => {
            let x = await el.getAttribute("data-x")
            let y = await el.getAttribute("data-y")
            let text = await textEls[i].getText();
            let colour = await textEls[i].getCSSProperty("fill")
            let quadrant = await el.getAttribute(`data-area`)
            let location = await el.getLocation();
            return {
                x,
                y,
                text,
                quadrant,
                colour,
                location
            }
        }))
    },

    getQuadrantExpander: async function (desiredQuadrant) {
        await new Promise(res => setTimeout(() => { res() }, 100));
        let expander = await $(`//*[name()="g" and @data-testid="qc-expander-${desiredQuadrant}"]`)
        let expanderIcon = await $(`//*[name()="g" and @data-testid="qc-expander-${desiredQuadrant}"]/*[name()="path"]`)
        let d = await expanderIcon.getAttribute('d') == "m 11 11 m 5 0 h 5 v 5 h -1.5 v -2.5 l -6 6 h 2.5 v 1.5 h -5 v -5 h 1.5 v 2.5 l 6 -6 h -2.5 z" ? "expand" : "collapse";
        // console.log('d =>', d)
        await expander.moveTo()
        await expander.waitForDisplayed();
        return {
            el: expander,
            icon: d
        };
    },

    getVerticalDivider: async function () {
        let els = await $$(`//*[name()="rect" and @data-testid="qc-divider-vertical"]`)
        let el = (await Promise.all(els.map(async el => {
            await el.waitForDisplayed({ timeout: 250 })
            if (await el.isDisplayed()) {
                return el;
            }
            return null
        }))).find(el => el)
        return el;
    },

    toggleFactorsAndAttributes: async function () {
        await new Promise(res => setTimeout(() => { res() }, 100));
        let toggle = await $(`//span[text()="Factors"]/../../following-sibling::span//input[@type="checkbox"]`);
        await toggle.waitForExist();
        await toggle.click()
        await new Promise(res => setTimeout(() => { res() }, 100));
    },

    getToggleFactorsAndAttributes: async function () {
        return await $(`//span[text()="Factors"]/../../following-sibling::span//input[@type="checkbox"]`);
    },


    getDriversOfPrimaryBrandsColor: async function () {
        let elem = await $(`//span[text()="Drivers of Primary Brand"]/preceding-sibling::*/*[name()="rect"]`);
        if (await elem.isDisplayed()) {
            return await elem.getCSSProperty("fill");
        }
        return null;
    },

    getDriversOfSelectedBrandsColor: async function () {
        let elem = await $(`//span[text()="Drivers of Selected Brands"]/preceding-sibling::*/*[name()="rect"]`);
        try {
            await elem.waitForDisplayed({ timeout: 5000, interval: 100 })
        } catch (e) { }

        if (await elem.isDisplayed()) {
            return await elem.getCSSProperty("fill");
        }
        return null;
    },

    clickQuadrantSummaryViewButton: async function () {
        let elem = await $(`//div/span[text()="Purpose"]/../../div/button//*[name()="path" and contains(@d,"M6")]/../..`);
        await elem.click();
        await new Promise(res => setTimeout(() => { res() }, 500));
    },

    clickQuadrantDefaultViewButton: async function () {
        let elem = await $(`//div/span[text()="Purpose"]/../../div/button//*[name()="path" and contains(@d,"M2")]/../..`);
        await elem.click();
        await new Promise(res => setTimeout(() => { res() }, 500));
    },

    getSummaryChartContents: async function () {
        await new Promise(res => setTimeout(() => { res() }, 1000));
        let textEls = await $$(`//*[name()="g" and contains(@id,"qc-point-")]/*[name()="text"]`);
        textEls = (await Promise.all(textEls.map(async (el) => {
            try {
                await el.waitForDisplayed({ timeout: 5000, interval: 100 })
            } catch (e) { }
            if (await el.isDisplayed()) {
                return el;
            }
        }))).filter(el => el);

        console.log(`text els length => ${textEls.length}`)

        let points = await Promise.all(textEls.map(async (te) => {
            let text = await te.getText();
            let colour = await te.getCSSProperty('fill');
            let location = await te.getLocation();

            if (await te.isDisplayed()) {
                return {
                    text,
                    colour,
                    location
                }
            }
        }))
        // points = points.filter(el => el);

        let maintainAndBuildLoc = await (await $(`//*[text()="Maintain and Build"]/..`)).getLocation();
        let developLoc = await (await $(`//*[text()="Develop"]/..`)).getLocation();
        let deprioritizeLoc = await (await $(`//*[text()="Deprioritize"]/..`)).getLocation();

        let maintainandBuildEls = points.filter(el => parseInt(el.location.x) >= parseInt(maintainAndBuildLoc.x) && parseInt(el.location.x) < parseInt(maintainAndBuildLoc.x + 20))
        let developEls = points.filter(el => parseInt(el.location.x) >= parseInt(developLoc.x) && parseInt(el.location.x) < parseInt(developLoc.x + 20))
        let deprioritizeEls = points.filter(el => parseInt(el.location.x) >= parseInt(deprioritizeLoc.x) && parseInt(el.location.x) < parseInt(deprioritizeLoc.x + 20))

        return {
            maintain: maintainandBuildEls,
            develop: developEls,
            deprioritize: deprioritizeEls
        }
    },
}