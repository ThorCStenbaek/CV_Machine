
export const  startingMeta={
    ID: null, // This will be auto-incremented by the database
    resource_id: null, // You might need to provide this value based on your application's logic
    fileID: null,
    ordering: 0, // Default value, change as needed
    html_element: 'div' , // Provide a value based on your application's logic
    number_of_children: 0,
    specific_style: 'height: 100px; width: 100px; position: relative; overflow:hidden;', // Provide a value based on your application's logic
    content_type: '' , // Provide a value based on your application's logic
    content_data: '',
    instruction: 'TEST_ELEMENT', // Provide a value based on your application's logic
    depth:1,
    rules:{selectable:true, draggable:true}
};