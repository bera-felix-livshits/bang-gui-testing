const relationshipMap = require('../page-objects/common-components/relationship-map');
const analysisPeriodSelector = require('./common-components/analysis-period-selector-and-filters.js');
const customClick = require('../utilities/custom-click.js');
const camelize = require('../utilities/camelize');

const scrapeBrandPositioningHierarchyView = require("./page-helpers/scrape-brand-positioning-hierarchy-view.js");
const scrapeBrandPositionTableView = require("./page-helpers/scrape-brand-position-table-view.js");
const scrapeForQuadrentContent = require("./page-helpers/scrape-brand-position-chart-view.js");
// const { generatePillarsObj } = require("./common-components/scrape-brandpositioning-hierarchy-view.js");

const scrapeBrandPositioningQuandrant = require("./page-helpers/scrape-brand-positioning-quadrant.js");
const waitForLoadingToComplete = require('./common-components/wait-for-loading-to-complete');


module.exports = {

    getNameFromImageIconTopLeft: async function () {
        let els = await $$(`//div/span[text()]/../preceding-sibling::div/img[@alt and @height]`);
        let target = (await Promise.all(els.map(async (el) => {
            await el.waitForExist();
            if (await el.isDisplayed()) {
                return el;
            }
            return null;
        }))).filter(el => el);
        console.log("target.length =>", target.length)
        target = target.find(el => el);
        return await target.getAttribute('alt');
    },

    isBrandPositioningHeaderDisplayed: async function () {
        let maintXPath = `//main//span[contains(@class, "MuiTypography-root") and text()="Brand Positioning"]`;
        let elem = await $(maintXPath);
        await elem.waitForDisplayed();
        return await elem.isDisplayed();
    },

    getAudienceBeingUsed: async function () {
        let elem = await $(`//div[@style="display: flex; justify-content: center; align-items: center;"]/span/span[string-length(text()) > 0]`)
        await elem.waitForDisplayed();
        return await elem.getText();
    },

    getPrimaryBrandBeingUsed: async function () {
        let elem = await $(`//div[@style="padding-left: 16px; padding-right: 0px; height: 56px;"]/div[count(child::span)=2]/span[1]`);
        await elem.waitForDisplayed();
        return await elem.getText();
    },

    clickChartViewButton: async function () {
        let elem = await $(`//button[@title="Visualize and compare relationship stage based on geography."]`);
        await new Promise(res => { setTimeout(() => { res() }, 100); })
        await elem.isDisplayed();
        await elem.click();
    },

    clickTableViewButton: async function () {
        let elem = await $(`//button[@title="Table view tooltip text"]`);
        await new Promise(res => { setTimeout(() => { res() }, 100); })
        await elem.isDisplayed();
        await elem.click();
    },

    clickHierarchyViewButton: async function () {
        let elem = await $(`//button[@title="Hierarchy view tooltip text"]`);
        await new Promise(res => { setTimeout(() => { res() }, 100); })
        await elem.isDisplayed();
        await elem.click();
    },

    clickQuadrantViewButton: async function () {
        let elem = await $(`//button[@title="DNA view tooltip text"]`);
        await elem.isDisplayed();
        await elem.click();
    },


    isChartViewDisplayed: async function () {
        let elem = await $(`//span[text()="Chart View"]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    isTableViewDisplayed: async function () {
        let elem = await $(`//span[text()="Table View"]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    isHierarchyViewDisplayed: async function () {
        let elem = await $(`//span[text()="Hierarchy View"]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    isHierarchyViewDisplayed: async function () {
        let elem = await $(`//span[contains(text(),"Hierarchy View")]`);
        await elem.waitForExist();
        return await elem.isDisplayed();
    },

    toggleSampleSize: async function () {
        let featureVisualizationButton = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await featureVisualizationButton.isDisplayed();
        await featureVisualizationButton.click();

        let sampleSizeSpan = await $(`//span[text()="Sample Size"]`);

        await sampleSizeSpan.isDisplayed();
        await sampleSizeSpan.click();

        await browser.keys("\uE00C");
    },

    getToggleSampleSize: async function () {
        let featureVisualizationButton = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await featureVisualizationButton.isDisplayed();
        await featureVisualizationButton.click();

        let el = await $(`//span[text()="Sample Size"]`);
        await el.isDisplayed();

        await browser.keys("\uE00C");
        return el;
    },

    toggleDrivers: async function () {
        let featureVisualizationButton = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await featureVisualizationButton.isDisplayed();
        await featureVisualizationButton.click();

        let driversButton = await $(`//span[text()="Drivers"]`);

        await driversButton.isDisplayed();
        await driversButton.click();

        await waitForLoadingToComplete()
    },

    getToggleDrivers: async function () {
        let featureVisualizationButton = await $(`//button/*[@width="1em"]/*[contains(@d,"M14 6a2")]/..`);
        await featureVisualizationButton.isDisplayed();
        await featureVisualizationButton.click();

        let el = await $(`//span[text()="Drivers"]`);
        await el.isDisplayed();

        await browser.keys("\uE00C");
        return el;
    },

    getSampleSizeTextValue: async function () {
        await new Promise(res => setTimeout(() => { res() }, 250));
        let el = await $(`//*[name()="img"]/following-sibling::div[@title and @id]/div[@class="bsi-count"]`);
        if (await el.isExisting()) {
            await el.isDisplayed();
            let text = await el.getText();
            if (text === '...') {
                await new Promise(res => setTimeout(() => { res() }, 100));
                text = await this.getSampleSizeTextValue()
            }
            return text;
        }
        return "Sample size element does not exist";
    },

    getSampleSizeAttributes: async function () {
        await new Promise(res => { setTimeout(() => { res(); }, 250) })
        let sampleSize = await this.getSampleSizeTextValue();
        let el = await $(`//*[name()="img"]/following-sibling::div[@title and @id]/div[@class="bsi-count"]`);
        let colour = await el.getCSSProperty("color")

        let bsiIcon = await $(`//*[name()="img"]/following-sibling::div[@title and @id]/div[@class="bsi-icon"]`);
        await bsiIcon.waitForDisplayed();

        let toolTipTitle = await $(`//div[@title and @id]`)
        let toolTipValue = await toolTipTitle.getAttribute("title");
        return { sampleSize, colour, toolTipValue };
    },

    getSampleSizeAttriubutesFromSidebar: async function () {
        let bsiCountEls = await $$(`//div[@class="MuiCollapse-wrapperInner"]//div[@title and @id]/div[@class="bsi-count"]`);
        let brandNamesEls = await $$(`//div[@class="MuiCollapse-wrapperInner"]//div[@title and @id]/div[@class="bsi-count"]/../../span[1]`);
        let tooltips = await $$(`//div[@class="MuiCollapse-wrapperInner"]//div[@title and @id]`);
        return await Promise.all(bsiCountEls.map(async (el, i) => {
            let brandName = await brandNamesEls[i].getText();
            let tooltip = await tooltips[i].getAttribute('title');
            let sampleSize = await el.getText();
            let colour = await el.getCSSProperty("color");
            return {
                brandName,
                tooltip,
                sampleSize,
                colour
            }
        }))
    },

    clickOpenPageInfoButton: async function () {
        let infoButtonIconEl = await $(`//button[contains(@class, "MuiButton-outlined MuiButton-outlinedSizeLarge MuiButton-sizeLarge")]/span/*[name()="svg"]/../..`);
        await infoButtonIconEl.isDisplayed()
        await infoButtonIconEl.click();
    },

    clickClosePageInfoButton: async function () {
        let infoButtonIconEl = await $(`//iframe/preceding-sibling::div//button`);
        await infoButtonIconEl.isDisplayed()
        await infoButtonIconEl.click();
    },

    getPageSideBarInfoContents: async function () {
        let iframe = await $(`//iframe[@title="test"]`);
        await iframe.waitForExist();
        await browser.switchToFrame(iframe);
        let contentEl = await $(`//div[@id="bera-aside"]`);
        await contentEl.waitForExist();
        let location = await contentEl.getLocation();
        console.log(`location =>`, location);
        let content = await contentEl.getHTML(contentEl)
        await browser.switchToParentFrame();
        return content;
    },

    getPageSideBarHeader: async function () {
        let elem = await $(`//iframe[(contains(@style,'overflow-x: hidden'))]/..//span[string-length(text()) > 0]`);
        await elem.waitForDisplayed();
        return await elem.getText();
    },

    clickCloseSidebar: async function () {
        let elems = await $$(`//*[contains(@d,"M6.225") and @fill="currentColor" ]`);
        elems = await Promise.all(elems.map(async el => {
            await new Promise(res => { setTimeout(() => { res(); }, 250) })
            if (await el.isDisplayed()) {
                return el;
            }
            return null;
        }))
        let el = elems.find(el => el);
        await el.click();
    },

    isBrandPositioningInfoContentShowing: async function () {
        let infoButtonIconEl = await $(`//iframe/preceding-sibling::div//button`);
        await infoButtonIconEl.isExisting();
        let visible = await infoButtonIconEl.isDisplayedInViewport();
        console.log('visible =>', visible)
        return visible;
    },

    ///////////////////////////////// For Hieararchy view
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

    ...scrapeBrandPositioningHierarchyView,
    ...scrapeBrandPositionTableView,
    ...scrapeForQuadrentContent,
    ...relationshipMap,
    ...analysisPeriodSelector,
    ...scrapeBrandPositioningQuandrant,
    waitForLoadingToComplete
}