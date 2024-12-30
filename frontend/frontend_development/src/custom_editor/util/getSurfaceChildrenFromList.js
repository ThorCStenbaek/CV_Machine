

const getSurfaceChildrenFromList = (list) => {
    
    let children=[]
    let ignore=0
    for (let i = 0; i < list.length; i++) {
        if (ignore > 0) {
            ignore--
            ignore+=list[i].number_of_children
            continue
        }
        ignore+=list[i].number_of_children
        children.push(i)

    }
    return children

}
 
export default getSurfaceChildrenFromList;