function findPreviousNeighbourIndex(index, resourceMeta, ignoreAbsolute=true) {
    let depth = resourceMeta[index].depth;
    let previousNeighbourIndex = -1;

    for (let i = index - 1; i > -1; i--) {
        if (resourceMeta[i].depth < depth) {
            break; // found the parent's neighbour
        }
        if (resourceMeta[i].depth === depth && (!ignoreAbsolute || !resourceMeta[i].rules?.freeFloat )) {
            previousNeighbourIndex = i; // found neighbour
            break;
        }
    }

    return previousNeighbourIndex;
}

export default findPreviousNeighbourIndex;
