const fs = require('fs');
// const hierarchyObj = JSON.parse(fs.readFileSync("zzz.hierarchy-obj.json").toString());

const flattenHierarchyObj = (parentEl, flattenedObj = []) => {

    let copiedElement = JSON.parse(JSON.stringify(parentEl));
    delete copiedElement.children;
    if (copiedElement.pillarName) {
        flattenedObj.push(copiedElement);
    }

    parentEl.children.forEach(el => {
        flattenedObj = flattenHierarchyObj(el, flattenedObj)
    })
    return flattenedObj;
}

module.exports = flattenHierarchyObj;
// let flattend = flattenHierarchyObj(hierarchyObj);
// fs.writeFileSync('flattened-hierarchy-obj', JSON.stringify(flattend, null, 4));