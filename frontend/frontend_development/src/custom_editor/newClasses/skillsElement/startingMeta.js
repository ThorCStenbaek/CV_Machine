

const ImageMeta= {
    ID: null, // This will be auto-incremented by the database
    resource_id: null, // You might need to provide this value based on your application's logic
    fileID: null,
    ordering: 0, // Default value, change as needed
    html_element: 'img' , // Provide a value based on your application's logic
    number_of_children: 0,
    specific_style: '', // Provide a value based on your application's logic
    content_type: '' , // Provide a value based on your application's logic
    content_data: '[]', // Provide a value based on your application's logic
    instruction: 'SKILLS', // Provide a value based on your application's logic
    depth:0,
    rules:{
        draggable: true, 
        selectable: true, 
        newRowButton:false
    }

};

export const startingMeta =ImageMeta