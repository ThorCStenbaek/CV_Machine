function findNextNeighbourIndex(index, resourceMeta,ignoreAbsolute=true) {
    let depth = resourceMeta[index].depth;
    let nextNeighbourIndex = -1;

    for (let i = index + 1; i < resourceMeta.length; i++) {
        if (resourceMeta[i].depth < depth) {
            break; // found the parent's neighbour
        }
        if (resourceMeta[i].depth === depth  && (!ignoreAbsolute || !resourceMeta[i].rules?.freeFloat )) {
            nextNeighbourIndex = i; // found neighbour
            break;
        }
    }

    return nextNeighbourIndex;
}
export default findNextNeighbourIndex