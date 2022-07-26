module.exports = async (el) => {
    browser.execute("arguments[0].click();", el);
    await new Promise(res => {
        setTimeout(()=>{
            res();
        },200)
    })
}