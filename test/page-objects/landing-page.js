module.exports = {
    letsGetStartedWithExploreTheData: async function (){
        // await ((await $(`//*[text()='Explore the Data']`)).click());
        await ((await $(`//*[text()="Let's Get Started"]`)).click());
        // await ((await $(`//*[text()="Let's Get Started"]`)).click());
    }
}

