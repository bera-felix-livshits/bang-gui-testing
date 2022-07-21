module.exports = async (el) => {
    await browser.execute("arguments[0].click();", el);
}