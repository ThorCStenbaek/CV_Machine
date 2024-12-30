    const findNeigbour = (position, resourceMeta, side) => {

    if (side == 'left') {
      let i = position - 1;
      while (i >= 0) {
        if (resourceMeta[i].instruction == 'DEFAULT')
          return null;
        if (resourceMeta[i].instruction == 'EMPTY' || resourceMeta[i].instruction == 'TEXT' || resourceMeta[i].instruction == 'IMAGE') {
          return i;
        }

        i--;
      }
    }
    else {
      let i = position + 1;
      while (i < resourceMeta.length) {
        if (resourceMeta[i].instruction == 'DEFAULT')
          return null;
        if (resourceMeta[i].instruction == 'EMPTY' || resourceMeta[i].instruction == 'TEXT' || resourceMeta[i].instruction == 'IMAGE') {
          return i;
        }
        i++;
      }
    }


}


const findNeigbourSpecific = (position, resourceMeta, side, wrongNeighbour, rightNeighbours) => {
  if (side == 'left') {
    let i = position - 1;
    while (i >= 0) {
      if (resourceMeta[i].instruction == wrongNeighbour)
        return null;
      if (rightNeighbours.includes(resourceMeta[i].instruction)) {
        return i;
      }

      i--;
    }
  } else { // Assuming 'side' can only be 'left' or 'right'
    let i = position + 1;
    while (i < resourceMeta.length) {
      if (resourceMeta[i].instruction == wrongNeighbour)
        return null;
      if (rightNeighbours.includes(resourceMeta[i].instruction)) {
        return i;
      }
      i++;
    }
  }

  return null; // Return null if no valid neighbour is found
}







   
export  {findNeigbour, findNeigbourSpecific};