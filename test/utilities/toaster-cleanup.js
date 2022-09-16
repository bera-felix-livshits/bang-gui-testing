module.exports = async () => {
    await new Promise(res => setTimeout(() => res(), 100));
    let errorButtons = await $$(`//div[@class="MuiAlert-action"]//button[@title="Close"]`);
    await Promise.all(errorButtons.map(async errorButton => {
        console.log(`toaster cleaner getting called`)
        await errorButton.waitForDisplayed({ timeout: 1000, interval: 100 })
        if (await errorButton.isExisting()) {
            await errorButton.click()
        }
    }))

}