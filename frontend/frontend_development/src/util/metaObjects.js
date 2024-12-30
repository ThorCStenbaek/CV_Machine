const createMetaObjects = async (element) => {
    // Construct the meta object
    console.log("ELEMENT: ", element    )
    let innerMetaObjects=[]
    let allChildren= element.children
    for (let i=0; i<allChildren.length; i++){
 
          console.log("allchildren: ", allChildren)
        if (allChildren[i].tagName == "IMG") {
            console.log("img", allChildren[i].src)
            let actualPath = allChildren[i].src.split("//").slice(-1)[0]
            actualPath = actualPath.split("/", 10).splice(1).join("\\")
                console.log("actualPath: ", actualPath)
            try {
                
       
            let response = await fetch(`/api/file-id?filePath=${encodeURIComponent(actualPath)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
                let responseData = await response.json();
                 console.log("fileID: ", responseData)
                let fileID = responseData.fileId;
               

            const metaObject = {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: fileID, // This value is not applicable in this case
        ordering: 0, // Default value, change as needed
        html_element: 'img', // Provide a value based on your application's logic
        number_of_children: allChildren[i].childElementCount,
        specific_style: '', // Provide a value based on your application's logic
        content_type: 'img', // Provide a value based on your application's logic
        content_data: '',
                instruction: 'IMAGE',
        path: actualPath         // Provide a value based on your application's logic
    };
         innerMetaObjects.push(metaObject)
             if (allChildren[i].children.length >0){
           
            let recursiveChildren= await createMetaObjects(allChildren[i])
            for (let c=0; c<recursiveChildren.length; c++){
                innerMetaObjects.push( recursiveChildren[c])
            }    
        }
            }
            catch (error) {
                console.log("BIG ERROR: ", error)
            }

            continue
        }

        console.log("allChildren[i]: ", allChildren[i])
    const metaObject = {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: null, // This value is not applicable in this case
        ordering: 0, // Default value, change as needed
        html_element: allChildren[i].tagName.toLowerCase(), // Provide a value based on your application's logic
        number_of_children: allChildren[i].childElementCount,
        specific_style: '', // Provide a value based on your application's logic
        content_type: 'html', // Provide a value based on your application's logic
        content_data: fixChildProblem(allChildren[i].innerHTML),
        instruction: 'ELEMENT', // Provide a value based on your application's logic,
        class_name: allChildren[i].className,
    };
        innerMetaObjects.push(metaObject)
        if (allChildren[i].children.length >0){
           
            let recursiveChildren= await createMetaObjects(allChildren[i])
            for (let c=0; c<recursiveChildren.length; c++){
                innerMetaObjects.push( recursiveChildren[c])
            }    
        }
       
    }
    // Append the meta object using the function passed from the parent component
    console.log("METAOBJECTS: ", innerMetaObjects)
     return innerMetaObjects
};


function fixChildProblem(html){


let newHtml=""
let lastChar=""
let lastLeftArrow=0
    let lastSlash=0
let childNumber=0
let childPassed=0

for (let j=0; j<html.length; j++){

    if (html[j]==">"){
        
        if ( lastLeftArrow/2==lastSlash){
            lastChar=">"
            
            childPassed++


                newHtml+=`$child$`
            
        }
        continue
    
    }
    if (lastChar=="<" || html[j]=="<" ){
        
        lastChar="<"
        if (html[j]=="<"){
        lastLeftArrow++}
        
        if (html[j]=="/"){
            childNumber++
            lastSlash++
        }
        continue
    }
    else{
        newHtml+=html[j]
        
    }
}
 return newHtml   
}

export default createMetaObjects;