
import { CustomElement } from "./CustomElement";

export const CusteomElementTest = () =>{

     const testMeta= {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: null,
        ordering: 0, // Default value, change as needed
        html_element: 'coolguy' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: 'height: 100px; width: 100px; position: relative;', // Provide a value based on your application's logic
        content_type: '' , // Provide a value based on your application's logic
        content_data: '{"name":"bruh", "lol":"poopie"}',
        instruction: 'EMPTY', // Provide a value based on your application's logic
        depth:2,
        rules:{selectable:true, draggable:true}
    };
    
    
    
    
    const ReactTest = ({name, onClick, lol})=>{
    
      return <>bro</>
    }


    
   const inputElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
    return <>huh</>
   }
    
    console.log("THOR HELLO BEFORE")
      const a = new CustomElement(inputElement,"",testMeta, ReactTest )
    
      console.log("THOR HELLO:", a, a.startingMeta)
    
}