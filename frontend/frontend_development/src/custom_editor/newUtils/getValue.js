/*const returnRegex =(property) =>{
    const regex = new RegExp(`${property}\\s*:\\s*([^;]+)\\s*;?`);
    return regex}
    */
const returnRegex = (property) => {
        const regex = new RegExp(`(?<=^|[\\s;])${property}(?=[\\s:;])\\s*:\\s*([^;]+)\\s*;?`);
        return regex;
    };
    

    export const getValue = (property, style, onlyInt=false) => {
      const match = style.match(returnRegex(property));
    
      return match ? onlyInt ? match[1].trim().match(/[+-]?(?:\d*\.\d+|\d+)/)[0] :  match[1].trim() : null;
    };

    export const setValue = (property, value, style, notPX=false) => {
      const regex = returnRegex(property);
      const match= style.match(regex)

      if (match) {
       
          return style.replace(match[0], `${property}:${value}${notPX ? "":"px"};`);
      } else {
          return style.trim().length > 0 ? `${style} ${property}: ${value};` : `${property}: ${value};`;
      }
  };