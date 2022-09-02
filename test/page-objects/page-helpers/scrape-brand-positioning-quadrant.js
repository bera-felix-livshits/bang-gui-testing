

module.exports = {
    scrapeForQuadrentContent: async function () {
        try {
            let waiterPoint = await $(`//*[@class="qc-point" and name()="g"]`);
            await waiterPoint.waitForDisplayed();

            let waiterLabel = await $(`//*[@class="qc-point" and name()="g"]/*[name()="text"]`);
            await waiterLabel.waitForDisplayed();
        } catch (e) { }

        let pointEls = await $$(`//*[@class="qc-point" and name()="g"]`);
        let pointLabelEls = await $$(`//*[@class="qc-point" and name()="g"]/*[name()="text"]`);

        let labels = await Promise.all(pointLabelEls.map(async (label) => {
            return await label.getText();
        }))

        return await Promise.all(pointEls.map(async (point, i) => {
            let idRaw = (await point.getAttribute("data-testid")).replace('qc-point-', '');
            let label = labels.find(label => {
                let labelArr = label.split(' ');
                labelArr[0] = labelArr[0].toLowerCase();
                let compareValue = '';
                labelArr.forEach(el => compareValue += el)

                if ((compareValue === "protagonism" ? compareValue + "Factor" : compareValue) === idRaw) {
                    return label
                }
            })

            return {
                label,
                x: await point.getAttribute('data-x'),
                y: await point.getAttribute('data-y'),
                dataArea: await point.getAttribute('data-area')
            }
        }))
    }
};