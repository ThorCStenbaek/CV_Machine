import React, { useState } from 'react';
import Modal from '../containers/components/general/modal';




function ProportionalElements({ sizes, onClick, maxWidth= '23%', rows=1 }) {
    // Calculate the total sum of sizes
    const totalSum = sizes.reduce((sum, size) => sum + size, 0);

    const containerStyle = {
        display: 'flex',
        // Changes the cursor to indicate the element is clickable
        padding: '10px', // Adds some space inside the container
        boxSizing: 'border-box', // Ensures padding is included in the width
        backgroundColor: '#f0f0f0', // Light grey background
        gap: '10px', // Adds space between child elements
        
       
    };
    const outerContainerStyle = {
        margin: '10px',
        minWidth: '250px',
        width: maxWidth,
        border: '1px solid #000', // Changed to black for better visibility
        cursor: 'pointer', 

    }


    const childStyle = (size) => ({
        flex: `${size} 0 auto`, // Flex grow is set to the size
        minWidth: '20px', // Minimum width for very small elements
        backgroundColor: '#bbb', // Grey background
        display: 'flex',
        alignItems: 'center', // Centers text vertically
        justifyContent: 'center', // Centers text horizontally
        height: '50px', // Fixed height for all child elements
        border: '1px solid #888', // Darker border for the child elements
        borderRadius: '5px', // Rounded corners
    });



   return (
       <>
        <div onClick={onClick} style={outerContainerStyle} className='newRowElement' >
        {Array.from({ length: rows }, (_, rowIndex) => (
           <div style={containerStyle} >
                {sizes.map((size, sizeIndex) => (
                    <div key={`row-${rowIndex}-size-${sizeIndex}`} style={childStyle(size)}>
                        {`${size}/${totalSum}`}
                    </div>
                ))}
           </div>
        ))}
        </div>
</>
);

}








const NewRowModal = ({ appendNewElements, closeModal }) => {

    const [modalIsOpen, setModalIsOpen] = useState(false)
    

    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen)
    }




const constructChildren = (number, sizes=null, rows=1) => {
    const totalSum = sizes.reduce((sum, size) => sum + size, 0);
    let elements=[]
    while (rows > 0) {
     elements.push({
        html_element: 'div',
        number_of_children: number,
        specific_style: 'padding-left: 10px; padding-right: 10px; height: auto; width: 98%; display:flex; minHeight: 100px; align-items: stretch; justify-content: center; ',
        content_type: '',
        content_data: '',
        instruction: 'DEFAULT'
    })
    for (let i = 0; i < number; i++) {
        const percentage = (sizes[i] / totalSum) * 100;
        elements.push({
            html_element: 'div',
            number_of_children: 0,
            specific_style: `height: auto; minHeight: 100px; width: ${percentage}%; flex: 0 0 ${percentage}%; position: relative; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; `,
            content_type: '', 
            content_data: '',
           instruction: 'EMPTY',
class_name: 'element'
})
        }
        rows--
        }
return elements;
}



    const AddNewRow = (number, sizes = null, rows=1) => { 
        let elements = constructChildren(number, sizes, rows)
        console.log("all elements", elements)
        appendNewElements(elements, rows)
        closeModal()

    }
    
    const normalList = [[6], [3,3], [2,2,2],[1,1,1,1], [1,1,1,1,1], [1,1,1,1,1,1]]
    const strangerLists = [[5,1], [4,2], [2,3], [2,1,1], [2,2,1,1], [2,1,1,1,1],]
    const NormalRows = () => {
        return (
            <>
        
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {normalList.map((list, index) => (
                    <ProportionalElements key={index} sizes={list} onClick={() =>
                        AddNewRow(list.length, list)} />
                ))}
                                     {strangerLists.map((list, index) => (
                    <ProportionalElements key={index} sizes={list} onClick={() =>
                        AddNewRow(list.length, list)} />
                ))}
                </div>

            </>
        )
    }

    const [colNumber, setColNumber] = useState(1);
    const [rowNumber, setRowNumber] = useState(1);
    const [sizes, setSizes] = useState([1]); // Initial sizes array
    
    const handleInputChange = (e) => {
            
        const newColCount = Math.max(1, Math.min(12, Number(e.target.value))); // Ensure within bounds
        (e.target.name === "colNumber") ? setColNumber(newColCount) : setRowNumber(newColCount);
       

        // Update sizes array based on the new row count
        const newSizes = Array(newColCount).fill(1); // Fill with 1s
        if (e.target.name === "colNumber")
        setSizes(newSizes);
    };



    return (
        <>
            <h2>Add New Row</h2>
                    <button onClick={toggleModal}>Add custom</button>

            
        <NormalRows/>
            

            
            <Modal style={{width: '30vw', height: '50vw'}} isOpen={modalIsOpen} onClose={() => { console.log("MODAL CLOSED"); toggleModal(); }}>
                <h2>Custom Row</h2>
                <div>
                <label>Column</label>
            <input
                type="number"
                id="colNumber"
                name="colNumber"
                min="1"
                max="12"
                value={colNumber}
                onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Row</label>
                        <input
                type="number"
                id="rowNumber"
                name="rowNumber"
                min="1"
                max="12"
                value={rowNumber}
                onChange={handleInputChange}
                    />
                    </div>

           
            <ProportionalElements sizes={sizes} onClick={() => AddNewRow(sizes.length, sizes, rowNumber) } maxWidth='100%' rows={rowNumber} />

            </Modal>
        </>
    )

   
};

export default NewRowModal;
