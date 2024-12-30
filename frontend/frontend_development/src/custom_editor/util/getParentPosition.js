



const getParentPosition = (position, resourceMeta, counter = 0) => {

            if (position == 0) {
                return null;
            }
            if (position == 1) {
                return 0;
            }
            if (resourceMeta[position - 1].number_of_children > 0) {
              counter = counter - resourceMeta[position - 1].number_of_children
              
              if (counter < 0){
                  return position - 1
              }
          }

          counter++
            return getParentPosition(position - 1, resourceMeta, counter);
}
export default getParentPosition;