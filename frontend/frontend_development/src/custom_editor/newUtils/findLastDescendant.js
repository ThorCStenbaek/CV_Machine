function findLastDescendantIndex(index, resourceMeta) {
    let depth = resourceMeta[index].depth;
    let currentLastChildIndex = index;

    for (let i = index + 1; i < resourceMeta.length; i++) {
        if (resourceMeta[i].depth <= depth) {
            break;
        }
        currentLastChildIndex = i;
    }

    return currentLastChildIndex;
}

export default findLastDescendantIndex