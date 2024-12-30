const getAllPositions = (position, resourceMeta) => {
            let array = []; 
            const getInsertionPosition = (position, resourceMeta) => {
              
                const children = resourceMeta[position].number_of_children;
                let sum = 0;
            
                for (let i = 0; i < children; i++) {
                    sum += getInsertionPosition(position + i + 1, resourceMeta);
           
                }
                array.push(position)
                return sum + 1;
            
            }
            getInsertionPosition (position, resourceMeta)
        
            return array;
}
        
export default getAllPositions;