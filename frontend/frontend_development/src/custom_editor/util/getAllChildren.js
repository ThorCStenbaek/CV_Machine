

const getAllChildren = (position, resourceMeta) => {

     console.log("childPosition", position, resourceMeta)
    const number_of_children = resourceMeta[position].number_of_children;

    let children = [];
    let prevSubChild = 0;
    for (let i = 0; i < number_of_children; i++) {
        //Currentpos+1+prevSubChild
        const childPosition = position + i + 1 + prevSubChild;
        children.push(childPosition);
       
        if (resourceMeta[childPosition] && resourceMeta[childPosition].number_of_children === 0) continue; // If the child has no children, skip it (no need to recurse

        const subChildren = getAllChildren(childPosition, resourceMeta);
        prevSubChild = subChildren.length;
        children.push(...subChildren); // Spread operator to flatten the array
    }

    return children; 
}

export default getAllChildren;