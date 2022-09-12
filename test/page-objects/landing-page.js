module.exports = {
    letsGetStartedWithExploreTheData: async function (){
        // await ((await $(`//*[text()='Explore the Data']`)).click());
        await ((await $(`//*[text()="Let's Get Started"]`)).click());
        // await ((await $(`//*[text()="Let's Get Started"]`)).click());
    },


    selectDataSet: async function (desiredDataSet) {
        let dataSetDiv = await $(`//div[text()="Dataset"]/following-sibling::div`);
        await dataSetDiv.waitForDisplayed();
        await dataSetDiv.click();
        
        await new Promise(res => setTimeout( ()=> res(), 100));

        let inputBox = await $(`//div[@role="option"]//input[@type="search"]`)
        await inputBox.waitForDisplayed()
        await inputBox.setValue(desiredDataSet)

        await new Promise(res => setTimeout( ()=> res(), 100));

        let option = await $(`//li[@role="option"]/div[contains(text(), "${desiredDataSet}")]`)
        await option.waitForDisplayed();
        await option.click();

        await new Promise(res => setTimeout( ()=> res(), 100));
    },
}

