const customClick = require('../utilities/custom-click');

module.exports = {
    clickEngagement: async function () {
        let el = await $(`//button[@data-testid="view-segment"]`);
        await el.waitForDisplayed({ timeout: 10000, interval: 100 });
        await el.click();
    },

    clickPieChart: async function () {
        let el = await $(`//button[@data-testid="view-who"]`);
        await el.waitForDisplayed({ timeout: 10000, interval: 100 });
        await el.click();
    },

    clickCrosstab: async function () {
        let el = await $(`//button[@data-testid="view-crosstab"]`);
        await el.waitForDisplayed({ timeout: 10000, interval: 100 });
        await el.click();
    },

    isWhereAreTheyDisplayed: async function () {
        let el = await $(`//span[text()="Where Are They?"]`);
        try {
            await el.waitForDisplayed({ timeout: 10000, interval: 100 });
            return await el.isDisplayed();
        } catch (e) {
            return false;
        }
    },

    clickMap: async function () {
        // data-testid="view-where"
        let el = await $(`//button[@data-testid="view-where"]`);
        await el.waitForDisplayed({ timeout: 10000, interval: 100 });
        await el.click();
    },

    clickTotalPopulationTab: async function () {
        let el = await $(`//span[text()="Total Population"]`)
        await el.waitForDisplayed({ timeout: 10000, interval: 100 });
        await el.click();
        await new Promise(res => { setTimeout(() => { res() }, 500) });
    },

    clickBrandAudienceTab: async function () {
        let el = await $(`//span[text()="Brand Audience"]`)
        await el.waitForDisplayed({ timeout: 10000, interval: 100 });
        await el.click();
        await new Promise(res => { setTimeout(() => { res() }, 500) });
    },

    isAudienceProfilingHeaderDisplayed: async function () {
        let maintXPath = `//main//span[contains(@class, "MuiTypography-root") and text()="Audience Profiling"]`;
        let elem = await $(maintXPath);
        await elem.waitForDisplayed();
        return await elem.isDisplayed();
    },

    clickNextBrand: async function () {
        // let rectButton = await $(`//*[name()="g" and @data-testid="sc-pagination-next"]`);
        let rectButton = await $(`//*[name()="g" and @data-testid="sc-pagination-next"]/*[name()="path"]`);
        await rectButton.waitForDisplayed({ timeout: 10000, interval: 100 });
        if (await rectButton.isClickable()) {
            await rectButton.click();
        }
    },

    getNextBrandButton: async function () {
        // let rectButton = await $(`//*[name()="g" and @data-testid="sc-pagination-next"]`);
        let rectButton = await $(`//*[name()="g" and @data-testid="sc-pagination-next"]/*[name()="rect"]`);
        await rectButton.waitForDisplayed({ timeout: 10000, interval: 100 });
        return rectButton;
    },

    clickPreviousBrand: async function () {
        // let rectButton = await $(`//*[name()="g" and @data-testid="sc-pagination-previous"]`);
        let rectButton = await $(`//*[name()="g" and @data-testid="sc-pagination-previous"]/*[name()="path"]`);
        await rectButton.waitForDisplayed({ timeout: 10000, interval: 100 });
        if (await rectButton.isClickable()) {
            await rectButton.click();
        }
    },

    getPreviousBrandButton: async function () {
        // let rectButton = await $(`//*[name()="g" and @data-testid="sc-pagination-previous"]`);
        let rectButton = await $(`//*[name()="g" and @data-testid="sc-pagination-previous"]/*[name()="rect"]`);
        await rectButton.waitForDisplayed({ timeout: 10000, interval: 100 });
        return rectButton;
    },

    getBrandNameEl: async function () {
        const xpath = `//*[name()="g" and contains(@data-testid, "sc-segment-row-b:")]//*[name()="image"]/following-sibling::*[name()="text"][1]`;
        let tmp = await $(xpath);
        await tmp.waitForExist();

        let els = await $$(xpath);
        console.log("els.length =>", els.length);
        return await Promise.all(els.map(async (el, i) => {
            await el.waitForExist({ timeout: 10000, interval: 100 });
            let text = await el.getText();
            let location = await el.getLocation();
            let size = await el.getSize();
            return {
                text,
                ...location,
                ...size
            }
        }))
    },

    getUseConSegmentValue: async function (useConSegment) {
        let useConEls = await $$(`//*[@data-testid="sc-segment-${useConSegment}-block-label"]/*[name()="text"]`)
        return await Promise.all(useConEls.map(async el => {
            await el.waitForExist({ timeout: 10000, interval: 100 });
            let text = await el.getText();
            let location = await el.getLocation();
            let size = await el.getSize();
            return {
                text,
                ...location,
                ...size
            }
        }))
    },

    getWhoAreTheySelectedViewPortSize: async function () {
        let gridEl = await $(`//*[name()="rect" and @data-testid="sc-grid-bg"]`)
        let location = await gridEl.getLocation();
        let size = await gridEl.getSize();
        console.log("Location of parent grid:", location)
        console.log("Size of parent grid:", size)
        return {
            ...location,
            ...size
        }
    },

    getWhoAreTheySection: async function (dataObj = {}) {
        let masterLocSize = await this.getWhoAreTheySelectedViewPortSize();
        let brandNameEls = await this.getBrandNameEl();

        let index = brandNameEls.findIndex(el => {
            return ((el.y > masterLocSize.y) && ((el.y + el.height) < (masterLocSize.y + masterLocSize.height)))
        })
        console.log('index =>', index);
        dataObj[brandNameEls[index].text] = {
            unawares: (await this.getUseConSegmentValue("unawares"))[index].text,
            rejecters: (await this.getUseConSegmentValue("rejecters"))[index].text,
            lapsed: (await this.getUseConSegmentValue("lapsed"))[index].text,
            winbacks: (await this.getUseConSegmentValue("winbacks"))[index].text,
            prospects: (await this.getUseConSegmentValue("prospects"))[index].text,
            switchers: (await this.getUseConSegmentValue("switchers"))[index].text,
            loyals: (await this.getUseConSegmentValue("loyals"))[index].text
        }

        let nextBrandButton = await this.getNextBrandButton();
        let clickable = await nextBrandButton.getAttribute("opacity");
        console.log("Is next brand button clickable =>", clickable)

        if (clickable === "1") {
            await nextBrandButton.click();
            await new Promise(res => { setTimeout(() => { res() }, 100) });
            dataObj = await this.getWhoAreTheySection(dataObj);
        }
        return dataObj;
    },

    cycleToBrand: async function (brandName, resetValue = false, index = 0) {
        let previousBrandButton = await this.getPreviousBrandButton();
        let clickable = await previousBrandButton.getAttribute("opacity");
        console.log("Is previous brand button clickable =>", clickable)

        if (clickable === "1" && !resetValue) {
            console.log('clicking previous')
            let previousBrandButton = await this.getPreviousBrandButton();
            // await customClick(previousBrandButton)
            await previousBrandButton.click({ x: 5, y: 5 });
            await this.clickPreviousBrand();
            console.log("clicked previous")

            await new Promise(res => { setTimeout(() => { res() }, 100) });
            return await this.cycleToBrand(brandName);
        } else {
            resetValue = true;
            let brandNameEls = await this.getBrandNameEl();

            let targetIndex = brandNameEls.findIndex(el => el.text == brandName)
            let masterLocSize = await this.getWhoAreTheySelectedViewPortSize();
            let currentIndex = brandNameEls.findIndex(el => {
                return ((el.y > masterLocSize.y) && ((el.y + el.height) < (masterLocSize.y + masterLocSize.height)))
            })

            console.log("targetIndex =>", targetIndex)
            console.log("currentIndex =>", currentIndex)

            if (currentIndex < targetIndex) {
                let nextBrandButton = await this.getNextBrandButton();

                // await customClick(nextBrandButton);
                await nextBrandButton.click({ x: 5, y: 5 });
                index++
                // await this.clickNextBrand()

                await new Promise(res => { setTimeout(() => { res() }, 100) })
                return await this.cycleToBrand(brandName, resetValue)
            }
            return index;
        }
    },

    getWhoAreTheySectionLocationAndSize: async function () {
        let whoAreTheySection = await $(`//*[name()="svg" and @data-testid="segmentation-chart"]`);
        return {
            ... (await whoAreTheySection.getSize()),
            ... (await whoAreTheySection.getLocation())
        }
    },

    getWhoAreTheyVisualizationApCardsLocationsAndSize: async function () {
        let cards = await $$(`//div[@class="ap-card"]`);
        return await Promise.all(cards.map(async card => {
            return {
                ... (await card.getLocation()),
                ... (await card.getSize())
            }
        }))
    },

    getSegmentWithBar: async function (segmentName, counter = 0) {
        try {
            // await new Promise(res => { setTimeout(() => { res() }, 500) });
            let headingEls = await $$(`//span[text()="${segmentName}"]/../../..//div[@title]`);
            let valueEls = await $$(`//span[text()="${segmentName}"]/../../..//*[name()="text" and @id]/*[name()="tspan"]`);
            let obj = {};

            await Promise.all(headingEls.map(async (el, i) => {
                // await el.waitForExist({ timeout: 5000, interval: 100 });
                // await el.waitForDisplayed({ timeout: 5000, interval: 100 });
                let heading = await el.getText();
                await valueEls[i].waitForDisplayed({ timeout: 5000, interval: 100 });

                let value = await valueEls[i].getText();
                obj[heading] = value;
            }))

            return obj;
        } catch (e) {
            counter++;
            console.log("error =>", e)
            if (counter < 15) {
                await new Promise(res => { setTimeout(() => { res() }, 5000) });
                return await this.getSegmentWithBar(segmentName, counter);
            }
            return null;
        }
    },

    getSegmentSideBySide: async function (segmentName, counter = 0) {
        try {
            // await new Promise(res => { setTimeout(() => { res() }, 500) });
            let headingEls = await $$(`//span[text()="${segmentName}"]/../../..//div[@title]`);
            let valueEls = await $$(`//span[text()="${segmentName}"]/../../..//div[@title]/following-sibling::div[text()]`);
            let obj = {};

            await Promise.all(headingEls.map(async (el, i) => {
                // await el.waitForExist({ timeout: 5000, interval: 100 });
                // await el.waitForDisplayed({ timeout: 5000, interval: 100 });
                let heading = await el.getText();
                await valueEls[i].waitForDisplayed({ timeout: 5000, interval: 100 });

                let value = await valueEls[i].getText();
                obj[heading] = value;

            }))

            return obj;
        } catch (e) {
            counter++;
            console.log("error =>", e)
            if (counter < 15) {
                await new Promise(res => { setTimeout(() => { res() }, 500) });
                return await this.getSegmentSideBySide(segmentName, counter);
            }
            return null;
        }
    },

    getSegmentAge: async function () {
        return await this.getSegmentWithBar("Age");
    },

    getSegmentGender: async function () {
        return await this.getSegmentSideBySide("Gender");
    },

    getSegmentEthnicity: async function () {
        return await this.getSegmentWithBar("Ethnicity");
    },

    getSegmentEducation: async function () {
        return await this.getSegmentSideBySide("Education");
    },

    getSegmentHouseholdIncome: async function () {
        return await this.getSegmentWithBar("Household Income");
    },

    getSegmentCategorySpend: async function () {
        return await this.getSegmentWithBar("Category Spend");
    },

    getSegmentOrientation: async function () {
        return await this.getSegmentWithBar("Orientation");
    },

    getSegmentShareOfWallet: async function () {
        return await this.getSegmentWithBar("Share of Wallet");
    },

    ///////Engagement 

    getEngagementSegmentsBarCharts: async function () {
        let waitingEl = await $(`//*[@class="sc-segment-row"]//*[name()="image"]/following-sibling::*[name()="text"][1]`);
        await waitingEl.waitForExist({ timeout: 10000, interval: 100 });

        let brandNameEls = await $$(`//*[@class="sc-segment-row"]//*[name()="image"]/following-sibling::*[name()="text"][1]`);
        let brandNames = await Promise.all(brandNameEls.map(async el => {
            await el.waitForDisplayed({ timeout: 10000, interval: 100 });
            return await el.getText();
        }))

        let dataObj = await this.getSegmentByBrand(brandNames)
        let dataObjSorted = {};
        await Promise.all(Object.keys(dataObj).map(async brandName => {
            dataObjSorted[brandName] = {}
            let orderedByLoc = Object.keys(dataObj[brandName]).sort((a, b) => {
                if (dataObj[brandName][a].location.x < dataObj[brandName][b].location.x) { return -1 } else { return 1; }
            })

            orderedByLoc.forEach(el => {
                dataObjSorted[brandName][el] = dataObj[brandName][el]
            })

            let [nonCustomers, customers] = await this.getSegmentCustomersAndNonCustomersValues(brandName);

            dataObjSorted[brandName].nonCustomers = nonCustomers;
            dataObjSorted[brandName].customers = customers;
        }))

        return dataObjSorted;
    },

    getSegmentCustomersAndNonCustomersGroupingBar: async function (brandName) {
        let barComponentDivider = await $$(`//*[@class="sc-segment-row"]//*[text()="${brandName}"]/../..//*[@class="sc-segment-row-bars"]//*[name()="path"]`)
        return (await Promise.all(barComponentDivider.map(async el => {
            await el.waitForDisplayed({ timeout: 10000, interval: 100 });
            return {
                location: await el.getLocation(),
                size: await el.getSize()
            }
        }))).sort((a, b) => {
            if (a.x > b.x) { return -1; } else { return 1 }
        })
    },

    getSegmentCustomersAndNonCustomersValues: async function (brandName) {
        let barComponentSegments = await $$(`//*[@class="sc-segment-row"]//*[text()="${brandName}"]/../..//*[@class="sc-segment-row-bars"]//*[name()="text" and text()]`)
        return await Promise.all(barComponentSegments.map(async (el, i) => {
            await el.waitForDisplayed({ timeout: 10000, interval: 100 })
            if (i === 0) {
                return await el.getText();
            } else {
                return await el.getText();
            }
        }))
    },

    getSegmentByBrand: async function (brandNames) {
        let dataObj = {}
        await Promise.all(brandNames.map(async brandName => {
            let [nonCustomerGroupingBar, customerGroupingBar] = await this.getSegmentCustomersAndNonCustomersGroupingBar(brandName);
            let xpath = `//*[@class="sc-segment-row"]//*[text()="${brandName}"]/../following-sibling::*[@class="sc-segment-row-blocks"]`;
            let segmentBlockLabelElements = await $$(xpath + `//*[@class="sc-segment-block-label"]`)
            let segmentBlockNames = await Promise.all(segmentBlockLabelElements.map(async el => {
                let attributeValue = await el.getAttribute("data-testid");
                return attributeValue.replace("sc-segment-", '').replace("-block-label", "");
            }));
            dataObj[brandName] = {};
            // dataObj[brandName] = 
            await Promise.all(segmentBlockNames.map(async segmentName => {
                // dataObj[brandName][segmentName] = {};
                let rectEl = await $(xpath + `//*[@class="sc-segment-block-label" and contains(@data-testid, "${segmentName}")]/*[name()="rect"]`);
                let color = await rectEl.getCSSProperty("fill");
                let location = await rectEl.getLocation()

                let textEl = await $(xpath + `//*[@class="sc-segment-block-label" and contains(@data-testid, "${segmentName}")]/*[name()="text"]`);
                let value = await textEl.getText();

                dataObj[brandName][segmentName] = {
                    color,
                    location,
                    value,
                    group: location.x < customerGroupingBar.location.x ? "non-customers" : "customers"
                }
            }));
        }))

        return dataObj;
    },

    getLegend: async function () {
        let legendItems = await $$(`//*[contains(@data-testid,"sc-legend-type-") and contains(@data-testid ,"-label")]`);
        let legendNames = await Promise.all(legendItems.map(async legendItem => {
            await legendItem.waitForDisplayed({ timeout: 10000, interval: 100 });
            return await legendItem.getText();
        }))
        let dataObj = {};
        await Promise.all(legendNames.map(async legendName => {
            let el = await $(`//*[@data-testid="sc-legend-type-${legendName.toLowerCase()}-chip"]`)
            await el.waitForDisplayed({ timeout: 10000, interval: 100 });
            dataObj[legendName.toLowerCase()] = el;
        }))

        let locations = await Promise.all(legendNames.map(async legendName => {
            let el = await $(`//*[@data-testid="sc-legend-type-${legendName.toLowerCase()}-chip"]`)
            return {
                legendName,
                location: await el.getLocation()
            }
        }))

        locations.sort((a, b) => {
            if (a.location.x < b.location.x) { return -1; } else { return 1; }
        })
        console.log("ordered locations => ", locations.map(el => el.legendName))

        let sortedLegendObj = {}
        legendNames.forEach(legendName => {
            sortedLegendObj[legendName.toLowerCase()] = dataObj[legendName.toLowerCase()];
        })
        return sortedLegendObj;
    },

    getConnectors: async function () {
        let connectorsEls = await $$(`//*[contains(@class, "sc-connector sc-connector-")]`);
        return await Promise.all(connectorsEls.map(async el => {
            let segment = (await el.getAttribute("class")).replace("sc-connector sc-connector-", "");
            let selected = (await el.getAttribute("opacity")) === "1" ? true : false;

            return {
                segment,
                selected
            }
        }))
    },

    getLegendToolTip: async function () {
        let dataObj = {};
        let readMoreEl = await $(`//*[@class="sc-tooltip-group"]/*[text()="Read More"]`);
        try {
            await readMoreEl.waitForDisplayed({ timeout: 1000, interval: 100 });
            dataObj.visible = true;
            dataObj.readMore = readMoreEl;
        } catch (e) {
            dataObj.visible = false;
            dataObj.readMore = null;
        }
        return dataObj;
    },

    //map page
    isMapCanvasDisplayed: async function () {
        let el = await $(`//canvas[@class="mapboxgl-canvas"]`);
        try {
            await el.waitForDisplayed({ timeout: 10000, interval: 100 });
            return await el.isDisplayed();
        } catch (e) { 
            return false;
        }
    },

    getPopulationForMapScreen: async function (){
        let el = await $(`//*[name()="svg" and contains(@id,"flag-icon")]/../preceding-sibling::span[text()]`)
        await el.waitForDisplayed({ timeout: 10000, interval: 100 });
        return await el.getText(); 
    },

    getLegend: async function() {
        let bins = await $$(`//span[text()="Under Index"]/following-sibling::div[contains(@class, "bin bin")]`)
        await Promise.all(bins.map(async el => {
            await el.waitForDisplayed({timeout:10000, interval: 100});
        }))
        try {
            return bins;
        } catch (e){
            return null;
        }
    }
}