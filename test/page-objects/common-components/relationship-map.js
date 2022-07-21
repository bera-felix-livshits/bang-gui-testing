const customClick = require('../../utilities/custom-click');

module.exports = {
    getLoveMap: async function () {
        let canvasMap = await $(`//canvas[@class="mapboxgl-canvas"]`);
        await canvasMap.waitForExist();
        await canvasMap.waitForDisplayed();
        return canvasMap;
    },

    clickRadiusButton: async function () {
        let radiusButton = await $(`//button[@value="radius"]`);
        await radiusButton.waitForExist();
        await radiusButton.waitForDisplayed();
        await radiusButton.click();
        customClick(radiusButton);
    },

    clickSquareAreaButton: async function () {
        let squareAreaButton = await $(`//button[@value="square-area"]`);
        await squareAreaButton.waitForExist();
        await squareAreaButton.waitForDisplayed();
        await squareAreaButton.click();
        customClick(squareAreaButton);
    },

    getLoveMapCountryRadioButtonCountryScale: async function () {
        let countryElem = await $(`//input[@type="radio" and @id="country"]`);
        await countryElem.waitForDisplayed();
        return countryElem;
    },

    getLoveMapCountryRadioButtonStateScale: async function () {
        let stateElem = await $(`//input[@type="radio" and @id="state"]`);
        await stateElem.waitForDisplayed();
        return stateElem;
    },

    getLoveMapCountryRadioButtonCityScale: async function () {
        let cityElem = await $(`//input[@type="radio" and @id="city"]`);
        await cityElem.waitForDisplayed();
        return cityElem;
    },

    getLoveMapCountryRadioButtoZipScale: async function () {
        let zipElem = await $(`//input[@type="radio" and @id="zip"]`);
        await zipElem.waitForDisplayed();
        return zipElem;
    },

    getMapCanvas: async function () {
        let elem = await $(`//canvas[@class="mapboxgl-canvas"]`);
        await elem.waitForDisplayed();
        let countryElem, stateElem, cityElem, zipElem;
        countryElem = await this.getLoveMapCountryRadioButtonCountryScale();
        stateElem = await this.getLoveMapCountryRadioButtonStateScale();
        cityElem = await this.getLoveMapCountryRadioButtonCityScale();
        zipElem = await this.getLoveMapCountryRadioButtoZipScale();

        return elem;
    },

    drawRectangleOnMapCanvasCoveringTheFullMap: async function () {
        let canvasMap = await this.getMapCanvas();
        // let squareAreaButton = await this.clickSquareAreaButton();
        await this.clickSquareAreaButton();
        await canvasMap.waitForDisplayed();

        // console.log(`does squareAreaButton exist => ${squareAreaButton.isDisplayed()}`)
        // await customClick(squareAreaButton);

        let location = await canvasMap.getLocation();

        let size = await canvasMap.getSize();
        let width = size.width; // 1637
        let height = size.height; //736
        console.log(`Height typeof ${typeof height}`)
        let width64Percent = parseInt(width * 0.64)
        let windowSize = await browser.getWindowSize();
        console.log(`Location => ${JSON.stringify(location)}`)

        console.log(`Height => ${height} && width => ${width}`)
        console.log(`size => ${JSON.stringify(size)}`)
        console.log(`window size => ${JSON.stringify(windowSize)}`)


        await browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', duration: 1500, x: location.x + 16, y: location.y + 5 },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },

                    { type: 'pointerMove', duration: 1500, x: location.x + 16, y: location.y + height - 16 },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },

                    { type: 'pointerMove', duration: 1500, x: location.x + width64Percent, y: location.y + height - 16 },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },

                    { type: 'pointerMove', duration: 1500, x: location.x + width64Percent, y: location.y + 5 },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },

                    { type: 'pointerMove', duration: 1500, x: location.x + width64Percent, y: location.y + 5 },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);

        await new Promise(res => {
            setTimeout(() => {
                res()
            }, 5000)
        })

    },

    doesSelectionExist: async function (isSelected) {
        let targetParentEl= `//div[text()="Selected Areas"]/following-sibling::div//p[contains(text(),"${isSelected}")]/..`;
        let selectedAreaElement = await $(targetParentEl);
        await selectedAreaElement.waitForExist();
        await selectedAreaElement.waitForDisplayed();
        return await selectedAreaElement.isDisplayed();
    }


}