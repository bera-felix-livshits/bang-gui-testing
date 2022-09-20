module.exports = async () => {
    let loadingDiv = await $(`//div[@class="bera-loading"]`)
    console.log("is loading div visible? =>", (await loadingDiv.isDisplayed()))
    await loadingDiv.waitForExist({
        timeout: 30000,
        reverse: true,
        timeoutMsg: "loading div is still visible",
        interval: 500
    })
    console.log("is loading div visible now? =>", (await loadingDiv.isDisplayed()))
}