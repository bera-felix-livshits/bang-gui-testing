const assert = require('assert');

const beraLoginPage = require("../page-objects/bera-login-page.js");
const landingPage = require("../page-objects/landing-page.js");
const brandSelectorPage = require("../page-objects/brand-selector-page.js");
const audienceDetailsPage = require("../page-objects/audience-details-page.js");
const overviewPage = require("../page-objects/overview-page.js");
const navBar = require('../page-objects/page-components/nav-bar');
const relationshipStage = require('../page-objects/relationship-page.js');

let brandNamesSelectedDuringFlow;

const customClick = require('../utilities/custom-click.js');

describe('Love Map Controls (Positive Flow) Test 1', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Brand Accelerator - Select let's get started with Explore the Data selected.`, async function () {
        await landingPage.selectDataSet("US Brandscape");
        await landingPage.letsGetStartedWithExploreTheData();
    })

    // it(`Brand Selector - Select 5 brands from the list available and click "Next" button`, async function () {
    //     await brandSelectorPage.addSpecificBrand("OshKosh");
    //     // await brandSelectorPage.addSpecificBrand("Rustler");
    //     // await brandSelectorPage.addSpecificBrand("Lee");
    //     // await brandSelectorPage.addSpecificBrand("London Fog");
    //     // await brandSelectorPage.addSpecificBrand("Perry Ellis");
    //     await brandSelectorPage.clickNextButton();
    // })
},)