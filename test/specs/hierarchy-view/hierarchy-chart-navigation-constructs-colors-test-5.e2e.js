const assert = require('assert');
const fs = require('fs');

const beraLoginPage = require("../../page-objects/bera-login-page.js");
const navBar = require('../../page-objects/page-components/nav-bar.js');
const overviewPage = require("../../page-objects/overview-page.js");
const brandPositioningPage = require("../../page-objects/brand-positioning-page.js");

const filtersSideBar = require("../../page-objects/page-components/analysis-period-selector-and-filters.js");

let hierarchyObj;

describe('Hierarchy Chart Navigation - Constructs Colors - Test 5', () => {
    it('Login to app.', async () => {
        await beraLoginPage.login();
    })

    it(`Select the "US Brandscape" dataset.`, async function () {
        await filtersSideBar.selectDataSet("US Brandscape");
    })

    it(`Select 5 brands from the list available`, async function () {
        await filtersSideBar.addPrimaryBrand("Coleman (active gear)");
        await filtersSideBar.addCompetitiveSetBrands([
            "Contigo",
            "Corkcicle",
            "Hydro Flask",
            "Igloo (coolers)"
        ])

        await filtersSideBar.clickCloseFiltersButton();
    })

    it(`Confirm that home page is displayed`, async function () {
        let brandEquitySummaryTable = await overviewPage.getNumericSummaryValues();
        // console.log(`\n\n brandEquitySummaryTable => \n${JSON.stringify(brandEquitySummaryTable, null, 4)}\n\n`)
        assert.notEqual(brandEquitySummaryTable["Brand Equity"]["BERA Score"], '');
    })

    it(`Navigate to Brand Positions Stage`, async function () {
        await navBar.clickBrandPositioning();
        let isBrandPositioningDisplayed = await brandPositioningPage.isBrandPositioningHeaderDisplayed()
        // console.log(`isRelStageDisplayed => ${isRelStageDisplayed}`);
        assert.equal(isBrandPositioningDisplayed, true, "Brand positioning is not displayed")
    })

    it(`Navigate to hierarchy view scape`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        let isBannerDisplayed = await brandPositioningPage.isHierarchyViewDisplayed()

        assert.equal(isBannerDisplayed, true, "Hierarchy banner is not displayed")
    })

    it(`Scrape hieararchy for values`, async function () {
        await brandPositioningPage.clickHierarchyViewButton();
        hierarchyObj = await brandPositioningPage.generatePillarsObj();
        console.log('!!! hierarchy obj =>', JSON.stringify(hierarchyObj, null, 4));
        // fs.writeFileSync(`./zzz.hierarchy-obj.json`, JSON.stringify(hierarchyObj, null, 4))
    })

    it(`Verify that that purpose and emotional constructs colors are apricot and orange`, async function () {
        let emotionalNode = hierarchyObj.children.find(el => el.pillarName == "Emotional");
        let purposeNode = hierarchyObj.children.find(el => el.pillarName == "Purpose");
        

        //rgb(251,120,45) = orange        
        assert.equal(emotionalNode.color.value, "rgb(251,120,45)", "Color value is mismatched for Emotional")

        //rgb(255,187,0) = apricot
        assert.equal(purposeNode.color.value, "rgb(255,187,0)", "Color value mismatch for Puropse")
    })

    it(`Verify cascading constructs are all present for "Purpose" and that the color is apricot`, async function () {
        let purposeNode = hierarchyObj.children.find(el => el.pillarName == "Purpose");
    
        assert.equal(purposeNode.children.find(el => el.pillarName == "Universal Connection").color.value.trim(), "rgb(255,187,0)", "Competence color is not matching");
        assert.equal(purposeNode.children.find(el => el.pillarName == "Consistent Focus").color.value.trim(), "rgb(255,187,0)", "Competence color is not matching");
        assert.equal(purposeNode.children.find(el => el.pillarName == "Social Impact").color.value.trim(), "rgb(255,187,0)", "Competence color is not matching");
        assert.equal(purposeNode.children.find(el => el.pillarName == "Protagonism Factor").color.value.trim(), "rgb(255,187,0)", "Competence color is not matching");
    })

    it(`Verify cascading constructs are all present for "Emotional" and that the color is orange`, async function () {
        let emotionalNode = hierarchyObj.children.find(el => el.pillarName == "Emotional");

        assert.equal(emotionalNode.children.find(el => el.pillarName == "Competence").color.value.trim(), "rgb(251,120,45)", "Competence color is not matching");
        assert.equal(emotionalNode.children.find(el => el.pillarName == "Excitement").color.value.trim(), "rgb(251,120,45)", "Competence color is not matching");
        assert.equal(emotionalNode.children.find(el => el.pillarName == "Ruggedness").color.value.trim(), "rgb(251,120,45)", "Competence color is not matching");
        assert.equal(emotionalNode.children.find(el => el.pillarName == "Sincerity").color.value.trim(), "rgb(251,120,45)", "Competence color is not matching");
        assert.equal(emotionalNode.children.find(el => el.pillarName == "Sophistication").color.value.trim(), "rgb(251,120,45)", "Competence color is not matching");

    })

    it(`Verify that the only colors used by constructs are Apricot and Orange`, async function (){
        let purposeNode = hierarchyObj.children.find(el => el.pillarName == "Purpose");
        let emotionalNode = hierarchyObj.children.find(el => el.pillarName == "Emotional");

        let colorElCollections = [];
        colorElCollections.push(purposeNode.color.value);
        colorElCollections.push(emotionalNode.color.value);

        purposeNode.children.forEach(el => colorElCollections.push(el.color.value));
        emotionalNode.children.forEach(el => colorElCollections.push(el.color.value));

        console.log(`colorElCollections =>`, colorElCollections);
        assert.equal(colorElCollections.every(el => el == "rgb(251,120,45)" || el == "rgb(255,187,0)" ), true )

    })
})