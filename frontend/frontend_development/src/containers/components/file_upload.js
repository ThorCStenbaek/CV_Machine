import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';

function FileUploadComponent({ onAppendMetaInfo, type, onImageSelect, buttonText="Upload", showButton=true, showCats=false, categories=null, accept= "image/*" }) {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);
    const [rights, setRights] = useState([]);
    const [selectedRight, setSelectedRight] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [step, setStep] = useState(1);

   
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
        console.log("file:", e.target.files[0])
        
        showButton ? console.log("not used") : uploadFile(e.target.files[0])
   setStep(4);
    };

        useEffect(() => {
        if (showCats) {
            fetch('/api/image-rights')
                .then(response => response.json())
                .then(data => setRights(data))
                .catch(error => console.error('Error fetching API:', error));
        }
    }, [showCats]);



    const onFilenameChange = (e) => {
        setFilename(e.target.value);
    };

    const onPrivateChange = (bool) => {
        setIsPrivate(bool);
        setStep(2);
    };

    const onSetSelectedCategories = (selectedCategories) => {
        setSelectedCategories(selectedCategories);
        console.log("selectedCategories", selectedCategories)
        if (selectedCategories.length > 0)
            setStep(3);
    };

    const onSetSelectedRight = (rightID) => {
        setSelectedRight(rightID);
          console.log("selectedCategories", selectedCategories)
        if (selectedCategories.length > 0)
            setStep(4);
    };


    const getFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        if (extension === 'pdf') {
            return 'pdf';
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return 'image';
        }
        return 'unknown';
    };

    const handleOnImageSelect = (givenID, givenPath) => {
        console.log("test: ", { id: givenID, path: givenPath})
        onImageSelect ?
            onImageSelect({ ID: givenID, path: givenPath}) : 
            console.log("no onImageSelect function passed to FileUploadComponent component")

     }
    
    const createMetaObject = (fileId, givenFile=null) => {
        // Construct the meta objectv
        console.log("hello, fileid: ",fileId    )
        const fileType = getFileType(file ? file.name : givenFile.name);
        if (fileType === 'unknown') {
        throw new Error("only takes images or pdfs");
    }
    console.log("fileid: ",fileId)
    const metaObject = {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: fileId,
        ordering: 0, // Default value, change as needed
        html_element: fileType === 'pdf' ? 'pdf' :'img' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: '', // Provide a value based on your application's logic
        content_type: fileType === 'pdf' ? 'pdf' :'img' , // Provide a value based on your application's logic
        content_data: '', // Provide a value based on your application's logic
        instruction: fileType === 'pdf' ? 'PDF' : fileType === 'image' ? 'IMAGE' : 'Unknown file type.' // Provide a value based on your application's logic
    };

    // Append the meta object using the function passed from the parent component
    onAppendMetaInfo(metaObject);
}


const uploadFile = (givenFile = null) => {
  const fileToUpload = file || givenFile;

  if (!fileToUpload) {
    alert('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  const fileName = filename || fileToUpload.name; // Use original file name if no custom name is provided
  formData.append('filename', fileName);
  formData.append('private', isPrivate);
    formData.append('file', fileToUpload);
    formData.append('categories', selectedCategories.join(','));
    formData.append('rights', selectedRight);


    fetch('/api/upload', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('data:', data);
      if (data.success) {
        showButton ? alert('File uploaded successfully with ID: ' + data.fileId.id) : console.log('File uploaded successfully with ID: ' + data.fileId.id);
        createMetaObject(data.fileId.id, givenFile);
        handleOnImageSelect(data.fileId.id, data.fileId.path);
      } else {
        alert('Error uploading file.');
      }
    })
    .catch((error) => {
        alert('Error uploading file: ' + error);
        console.log("error:" , error, formData)
    });
};




       return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter desired filename prefix"
                    value={filename}
                    onChange={onFilenameChange}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input
                    type="file"
                    onChange={onFileChange}
                    accept={accept}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            { /*(step >= 1 && showCats ) &&
            <div style={{ marginBottom: '20px' }}>
                <h4>Step 1: Is this image private?</h4>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                    <input
                        type="radio"
                        checked={isPrivate}
                        onChange={() => onPrivateChange(true)}
                        style={{ marginRight: '10px' }}
                    />
                    Yes, I want it to be private, so only I can use it
                </label>
                <label style={{ display: 'block' }}>
                    <input
                        type="radio"
                        checked={isPrivate==false}
                        onChange={() => onPrivateChange(false)}
                        style={{ marginRight: '10px' }}
                    />
                    No, I want it to be public, so everyone can see it
                </label>
            </div> */
}
           {/*  showCats && step >= 2 && (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <h4>Step 2: Choose at least one category</h4>
                        {categories.map((category) => (
                            <label key={category.ID} style={{ display: 'block', marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    value={category.ID}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onSetSelectedCategories([...selectedCategories, category.ID]);
                                        } else {
                                            onSetSelectedCategories(selectedCategories.filter((id) => id !== category.ID));
                                        }
                                    }}
                                    style={{ marginRight: '10px' }}
                                />
                                {category.Name}
                            </label>
                        ))}
                    </div>
                    {step >=3 &&
                    <div style={{ marginBottom: '20px' }}>
                        <h4>Step 3: Who owns this picture?</h4>

                        <label style={{ display: 'block', marginBottom: '10px' }}>
                            <input
                                type="radio"
                                value={0}
                                onChange={(e) => onSetSelectedRight(parseInt(e.target.value))}
                                checked={selectedRight === 0}
                                style={{ marginRight: '10px' }}
                            />
                            I own this picture and give Pycipedia the right to use it
                               </label>
                               <h6>
                                     I have the picture from the following source:
                               </h6>
                        {rights.map((right) => (
                            <div key={right.ID} style={{ display: 'block', marginBottom: '10px' }}>
                                <label>{right.String}</label>
                                <input
                                    type="radio"
                                    value={right.ID}
                                    onChange={(e) => onSetSelectedRight(parseInt(e.target.value))}
                                    checked={selectedRight === right.ID}
                                    style={{ marginRight: '10px' }}
                                />
                            </div>
                        ))}
                    </div> }
                </>
            )*/}            


            {showButton && (
                <button
                    onClick={uploadFile}
                       style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: (step < 4 || !showCats) ? 'grey' : '#28a745', color: '#fff', fontSize: '16px' }}
                       disabled={step < 4 || !showCats}
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
}


export default FileUploadComponent;
