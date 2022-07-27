module.exports = async (url) => {
    browser.execute(`window.open("${url}"),"_blank"`);
    await new Promise(res => {
        setTimeout(()=>{
            res();
        },200)
    })
}