
  const findFullPercentage = (position, resourceMeta) => {

    console.log("FINDFULL", position, resourceMeta  )
      
    let total = 0; 

     const regex = /flex: 0 0 (\d+(\.\d+)?)%/;








      let i = position ;
      while (i >= 0) {
        if (resourceMeta[i].instruction == 'DEFAULT')
          break
        if (resourceMeta[i].instruction == 'EMPTY' || resourceMeta[i].instruction == 'TEXT' || resourceMeta[i].instruction == 'IMAGE') {
          const match = resourceMeta[i].specific_style.match(regex);


          total+=  parseFloat(match[1]);
      

        }

        i--;
      }
    
  
      i = position + 1;
      while (i < resourceMeta.length) {
        if (resourceMeta[i].instruction == 'DEFAULT')
          break
        if (resourceMeta[i].instruction == 'EMPTY' || resourceMeta[i].instruction == 'TEXT' || resourceMeta[i].instruction == 'IMAGE') {
          const match = resourceMeta[i].specific_style.match(regex);


          total += parseFloat(match[1]);
         
        }
        i++;
      }
    

    return total; 
  }

export default findFullPercentage;