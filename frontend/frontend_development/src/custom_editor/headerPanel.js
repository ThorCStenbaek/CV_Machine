import React, { useEffect, useState } from 'react';
import PortraitLandscapeSVG from './icons/portraitLandscape';
import CoolInput from '../containers/components/general/coolInput';
import Hint from '../containers/components/general/Hint';

const HeaderPanel = ({ isStanding, setIsStanding, children, size, title, setTitle }) => {
    const [editableTitle, setEditableTitle] = useState(title);
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        console.log("HeaderPanel isStanding:", isStanding);
        setTitle(editableTitle);
    }, [isStanding, editableTitle, setTitle]);

    const handleChange = (event) => {
        setEditableTitle(event.target.value);
    };

    const toggleButtons = () => {
        setShowButtons(!showButtons);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxWidth: "500px", background: 'white' }}>
                <CoolInput 
                    label={'Title'} 
                    value={editableTitle} 
                    onChangeE={handleChange}
                    labelColorOn='black'
                    labelColorOff='black'
                    style={{ flexGrow: 0, marginRight: 'auto', borderBottom: 'lightgrey solid 1px', fontWeight: 'bold', fontSize: '18pt', maxWidth: '500px', padding: '5px', color: 'black' }}          
                />
              
            </div>
            <div style={{borderBottom: "1px solid lightgrey"}}>
              <p onClick={toggleButtons} style={{ margin: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {showButtons ? '- Hide page settings' : '+ Show page settings'}
                </p>
            <div className='headerPanelButtons' style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexGrow: 1, 
                gap: "5px", 
                alignItems: 'center', 
                paddingRight: "25px",
                    maxHeight: showButtons ? '100px' : '0', // Control the max height to create a sliding effect
                  overflow:  showButtons ?  'visible' : 'hidden' ,
                 // Hide content when collapsed
                transition: 'max-height 0.5s ease-in-out' // Smooth transition for sliding effect
                }}>
                    <Hint hintText="Choose between portrait and landscape orientation">
                <PortraitLandscapeSVG chosen={isStanding} onclick={() => setIsStanding(!isStanding)} degrees={-90} size={size} />
                </Hint>
                        {children}
            </div>
            </div>
        </div>
    );
}

export default HeaderPanel;
