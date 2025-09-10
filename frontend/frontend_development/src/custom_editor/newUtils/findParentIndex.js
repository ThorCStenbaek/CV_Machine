function findParentIndex(index, resourceMeta) {
    let depth = resourceMeta[index].depth;
    let parentIndex = index - 1;

    if (parentIndex<0)
        return 0

    for (let i = parentIndex; i > -1; i--) {
        if (resourceMeta[i].depth < depth) {
            parentIndex = i;
            break;
        }
    }

    return parentIndex;
}

export default findParentIndex