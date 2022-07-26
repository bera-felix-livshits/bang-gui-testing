module.exports = async (el) => {
    await sendDeleteUntilEmpty(el)
}

const sendDeleteUntilEmpty = async (el) =>{
    await el.click();
    //Adding both as it may be usecase specific where he curser is in the input field.
    await browser.keys("\uE003"); //backspace
    await browser.keys("\uE017"); //delete
    let value = await el.getAttribute('value')
    if(value != ''){
        sendDeleteUntilEmpty(el)
    }
}