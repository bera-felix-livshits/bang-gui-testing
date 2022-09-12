const assert = require('assert');

const beraLoginPage = require("../page-objects/bera-login-page.js");
const landingPage = require("../page-objects/landing-page.js");
const brandSelectorPage = require("../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../page-objects/audience-details-page.js");
const overviewPage = require("../page-objects/overview-page.js");
const navBar = require('../page-objects/common-components/nav-bar.js');
const relationshipStage = require('../page-objects/relationship-page.js');
const analysisPeriodSelector = require('../page-objects/common-components/analysis-period-selector-and-filters.js');

const mapBoxgl = require('mapbox-gl');

let brandNamesSelectedDuringFlow;

const customClick = require('../utilities/custom-click.js');
const { realpath } = require('fs');

describe('Love Map Controls (Positive Flow) Test 1', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    it(`Brand Selector - Select the 5 brands from sportswear and click "Next" button`, async function () {
        await brandSelectorPage.selectSpecificBrand("Adidas");
        await brandSelectorPage.selectSpecificBrand("Carhartt");
        await brandSelectorPage.selectSpecificBrand("Champion Sportswear");
        await brandSelectorPage.selectSpecificBrand("Columbia (clothing)");
        await brandSelectorPage.selectSpecificBrand("Dickie's");

        brandNamesSelectedDuringFlow = await brandSelectorPage.getSelectedBrands();
        await brandSelectorPage.clickNextButton();
    })

    it(`Audience Details - click the "Save & Finish" button`, async function () {
        await audienceDetailsPage.clickSaveAndFinishButton();
    })

    it(`Confirm that home page is displayed`, async function () {
        let brandEquitySummaryTable = await overviewPage.getNumericSummaryValues();
        // console.log(`\n\n brandEquitySummaryTable => \n${JSON.stringify(brandEquitySummaryTable, null, 4)}\n\n`)
        assert.notEqual(brandEquitySummaryTable["Brand Equity"]["BERA Score"], '');
    })

    it(`Navigate to Relationship Stage`, async function () {
        await navBar.clickRelationshipStage();
        let isRelStageDisplayed = await relationshipStage.isRelationshipStageVisible()
        // console.log(`isRelStageDisplayed => ${isRelStageDisplayed}`);
        assert.equal(isRelStageDisplayed, true)
    })


    it(`Click on the 'Map' button located to the right - top of the page directly below the filters button`, async function () {
        await relationshipStage.clickLoveMapIcon();
    })

    it(`Validate that circles appear for US & Canada`, async function () {
        
        await relationshipStage.drawRectangleOnMapCanvasCoveringTheFullMap();
        let drawnCirclesLocations = await relationshipStage.getLocationOfCircles();
        let circleLatLon = await relationshipStage.getLatLonOfCirclesDrawnOnLoveMap();
        await relationshipStage.clickCancelNewSelectionButton();

        console.log(`drawnCircles => ${JSON.stringify(drawnCirclesLocations, null, 4)}`)
        console.log(`circle lat lon =>`, JSON.stringify(circleLatLon, null ,4));
        

        await clickMap(circleLatLon)
        await new Promise(res => {
            setTimeout(()=>{
                res()
            },5000)
        })
        

    })
})

const clickMap = async (geoObj) =>{
    let canvas = await $('//canvas[@class="mapboxgl-canvas"]')
  
    await canvas.isDisplayed();
    console.log(`Canvas Object => \n\n\n${JSON.stringify(canvas, null, 4)}\n\n\n`)
    let size = await canvas.getSize();
    let location = await canvas.getLocation();

    console.log('canvas size =>', size)
    console.log('canvas location =>', location)

    browser.execute((map)=>{
        map.fire('click', [-95.71, 37.09])
    }, canvas)


    // const popup = new mapboxgl.Popup({ closeOnClick: false })
    // .setLngLat([-96, 37.8])
    // .setHTML('<h1>Hello World!</h1>')
    // .addTo(canvas);

    // browser.execute(`arguments[0].fire('click',{lngLat: {lon: ${geoObj.lon}, lat: ${geoObj.lat} }});`, canvas)

    // let locArr =[];
    // for (let x  = location.x; x <= location.x + size.width; x ++){
    //     for (let y = location.y; y <= location.y + size.height; y++){
    //         locArr.push({x, y})
    //     }
    // }

    // await Promise.all(locArr.map(async (el) => {
    //     canvas.moveTo(el.x, el.y)
    //     await new Promise(res=> {
    //         setTimeout(()=>{
    //             res();
    //         },1500)
    //     })
    // }))

    // browser.execute(`arguments[0].hover()`, canvas)
    // map.fireEvent('click', {latlng: L.latLng(28.04419, -81.947864)});
    // map.fire('click', [-118.3214,34.0318])
    // browser.execute(`arguments[0].fire('click', [${geoObj.lat}, ${geoObj.lon}]);`, canvas);

}