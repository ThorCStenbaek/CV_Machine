

//We need 
//input Element (for element panel)´
//Icon Element

//Render Element

//starting Meta


/**
 * starting meta should have these keys:
 * {
 *         html_element: 'div',
        number_of_children: number, //padding-left: 10px; padding-right: 10px; 
        specific_style: ` height: 100px;position: relative;  max-height: 100%;  width: ${parentWidth}; display:flex; align-items: stretch; justify-content: center;  max-width: 100%; flex-direction: row;  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;`,
        content_type: '',
        content_data: '',
        instruction: 'DEFAULT',
        depth: parentDepth+1,
        rules: {
            draggable: true, 
            selectable: true, 
            newRowButton: true,  
          }
 */
export class CustomElement{
  

    constructor(inputElement, buttonElement, startingMeta, renderElement){
        this.verifyInputElement(inputElement)
        this.verifyButtonElement(buttonElement)
        this.verifyStartingMeta(startingMeta)
        this.verifyRenderElement(renderElement)


        this.inputElement = inputElement;
        this.buttonElement = buttonElement;
        this.startingMeta = startingMeta;
        this.renderElement = renderElement;
    

    }

    verifyInputElement(inputElement){


        this.isReactComponent(inputElement)
        const requiredProps = [
           "position", "resourceMeta", "changeElement", "updateResourceMeta"
    ]; // Example props to check
        this.checkComponentProps(inputElement, requiredProps);
        

    }

    verifyButtonElement(buttonElement){

    }

    verifyStartingMeta(startingMeta) {
        if (!startingMeta || typeof startingMeta !== 'object') {
            throw new Error('startingMeta must be an object');
        }
    
        const requiredKeys = ['html_element', 'number_of_children', 'specific_style', 'content_type', 'content_data', 'instruction', 'depth', 'rules'];
        
        requiredKeys.forEach(key => {
            if (!(key in startingMeta)) {
                throw new Error(`Missing required key in startingMeta: ${key}`);
            }
        });
    
        if (typeof startingMeta.html_element !== 'string' || startingMeta.html_element.trim() === '') {
            throw new Error('html_element must be a non-empty string');
        }
    
        if (typeof startingMeta.number_of_children !== 'number' || startingMeta.number_of_children < 0) {
            throw new Error('number_of_children must be a non-negative number');
        }
    
        if (typeof startingMeta.specific_style !== 'string') {
            throw new Error('specific_style must be a string');
        }
    
        if (typeof startingMeta.content_type !== 'string') {
            throw new Error('content_type must be a string');
        }
    
        if (typeof startingMeta.content_data !== 'string') {
            throw new Error('content_data must be a string');
        }
    
        if (typeof startingMeta.instruction !== 'string' || startingMeta.instruction.trim() === '') {
            throw new Error('instruction must be a non-empty string');
        }
    
        if (typeof startingMeta.depth !== 'number' || startingMeta.depth < 0) {
            throw new Error('depth must be a non-negative number');
        }
    
        if (typeof startingMeta.rules !== 'object' || startingMeta.rules === null) {
            throw new Error('rules must be an object');
        }
    

    }
    

    verifyRenderElement(renderElement) {
            this.isReactComponent(renderElement)
          const requiredProps = ["name", "onClick"]; // Example props to check
          this.checkComponentProps(renderElement, requiredProps);
          

      }

isReactComponent(element) {
    const isComponent = (
        typeof element === 'function' || 
        (typeof element === 'object' && element !== null && 'render' in element)
    );

    if (!isComponent) {
        throw new Error(`Invalid renderElement: Expected a React component (function or class component).${typeof element}`);
    }

    return true;
}

checkComponentProps(component, propsToCheck) {
    let availableProps = new Set();
  
    // Check propTypes
    if (component.propTypes) {
      availableProps = new Set(Object.keys(component.propTypes));
    }
  
    // Check defaultProps
    if (component.defaultProps) {
      Object.keys(component.defaultProps).forEach((prop) => availableProps.add(prop));
    }
  
    // Extract parameter names if it's a functional component
    if (typeof component === "function") {
      const fnArgs = this.getFunctionParams(component);
      fnArgs.forEach((arg) => availableProps.add(arg));
    }
  
    // Validate required props
    const missingProps = propsToCheck.filter((prop) => !availableProps.has(prop));
  
    if (missingProps.length > 0) {
      throw new Error(`The component is missing required props: ${missingProps.join(', ')}`);
    } else {
      console.log(`The component accepts the required props: ${propsToCheck.join(', ')}`);
    }
  }
  
  getFunctionParams(fn) {
    const fnString = fn.toString();
    const match = fnString.match(/\(\s*{([^}]*)}\s*\)/);
    if (match && match[1]) {
      return match[1].split(",").map((param) => param.trim());
    }
    return [];
  }
  

}