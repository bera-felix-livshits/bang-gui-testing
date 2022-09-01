const fs = require('fs');
// const hierarchyObj = JSON.parse(fs.readFileSync("zzz.hierarchy-obj.json").toString());

const flattenHierarchyObj = (parentEl, flattenedObj = [], parents = []) => {

    let copiedElement = JSON.parse(JSON.stringify(parentEl));
    delete copiedElement.children;
    copiedElement.parents = parents
    if (copiedElement.pillarName) {
        if (copiedElement.parents.length == 0) {
            copiedElement.type = "construct";
        } else if (copiedElement.parents.length == 1) {
            copiedElement.type = "factor"
        } else {
            copiedElement.type = "attribute"
        }

        flattenedObj.push(copiedElement);
    }

    parentEl.children.forEach(el => {
        let newParents = JSON.parse(JSON.stringify(parents));
        if (parentEl.pillarName) {
            newParents.push(parentEl.pillarName)
        }
        flattenedObj = flattenHierarchyObj(el, flattenedObj, newParents)
    })
    return flattenedObj;
}

module.exports = flattenHierarchyObj;
// let flattened = flattenHierarchyObj(hierarchyObj);
// fs.writeFileSync('flattened-hierarchy-obj', JSON.stringify(flattened, null, 4));