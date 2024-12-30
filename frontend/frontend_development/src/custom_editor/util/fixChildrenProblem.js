

//Redundant function, not used in the code
const getAllChildrenBetter = (meta, position) => {

    let number_of_children = meta[position].number_of_children
    let children = []
    let highestChild= children[children.length-1]+1 || position+1
    
    while (number_of_children !== 0) {

        if (number_of_children > 0) {
            children.push(highestChild)
            children=children.concat(getAllChildrenBetter(meta, highestChild))
            number_of_children--
            highestChild=children[children.length-1]+1
        }
    }

    return children




}
/*
const fixMeta = (meta, position) => {

    let children = getAllChildrenBetter(meta, position)
    
    let positionCounter = 0
console.log("META", meta)
    for (let i = children[children.length-1]; i < meta.length; i++) {
        console.log("META", children)
        console.log("META", meta[i])
        if (meta[i].instruction != "ELEMENT") {
            positionCounter = i
            break
        }

    }
    console.log("META", positionCounter)
    meta.splice(position+1, positionCounter-position)

    console.log("META", meta)
    return meta


} 
 */

export default getAllChildrenBetter


