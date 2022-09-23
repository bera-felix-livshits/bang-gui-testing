module.exports = () => {
    let args = process.argv
    
    //data set is either prod or dev
    let dataSet = args.indexOf('--dataSet') > -1 ? args[args.indexOf('--dataSet') + 1] : null;

    //beta is the code state
    let codeState = args.indexOf(`--codeState`) > -1 ? args[args.indexOf(`--codeState`) + 1] : null;
    console.log("codeSate =>", codeState)
    return {
        dataSet,
        codeState
    }
}