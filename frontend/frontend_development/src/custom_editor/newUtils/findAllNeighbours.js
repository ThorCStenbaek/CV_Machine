import findNextNeighbourIndex from "./findNextNeighbour";
import findPreviousNeighbourIndex from "./findPreviousNeighbour";

export const findAllNeighbours =(index, resourceMeta) =>{

    let neighbours= []
    let neighbourPositions=[]
    let leftNeighbours=[]
    let rightNeighbours=[]

    let lastPrevNeighbour= index; 
    while (true){

        let prev = findPreviousNeighbourIndex(lastPrevNeighbour, resourceMeta)

        if (prev==-1)
            break
        neighbours.push(resourceMeta[prev])
        neighbourPositions.push(prev)
        lastPrevNeighbour=prev
        leftNeighbours.push({data: resourceMeta[prev], index: prev})


    }
    let lastNextNeighbour= index; 
    while (true){

        let next = findNextNeighbourIndex(lastNextNeighbour, resourceMeta)

        if (next==-1)
            break
        neighbours.push(resourceMeta[next])
        neighbourPositions.push(next)
        lastNextNeighbour=next
        rightNeighbours.push({data: resourceMeta[next], index:  next})


    }

    return({neighbours, neighbourIndexes: neighbourPositions, leftNeighbours, rightNeighbours})

}