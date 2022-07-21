module.exports = {
    scrollIntoView: async (el) => {
        browser.execute("arguments[0].scrollIntoView(true);", el)
    },
    scrollToTop: async (el) => {
        
    }
}