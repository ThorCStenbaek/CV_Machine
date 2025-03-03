export const findFlexPercentageOfElements =(elements) =>{

    const regex = /flex: 0 0 (\d+(\.\d+)?)%/;
    let total=0
    elements.forEach(element => {
  
      if (element.specific_style){
        const match = element.specific_style.match(regex);
        total+=  parseFloat(match[1]);
      }
        
      
    });
  
    return total;
  
  }

  export const findTotalWidthOfElements =(elements) =>{

    const regex = /width:\s*(\d+(\.\d+)?)px/;
    let total=0
    elements.forEach(element => {
  
      if (element.specific_style){
        const match = element.specific_style.match(regex);
        total+=  parseFloat(match[1]);
      }
        
      
    });
  
    return total;
  
  }
  
  