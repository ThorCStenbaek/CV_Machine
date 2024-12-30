    import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';







const SelectedAvailableBoxes = forwardRef(({ selected =[3], available =[1,2], nameMap = new Map( [ [1, "bruh"], [2, "bruh2"], [3, "bruh3"]]), selectedName, availableName, text}, ref) => {
    const [availableList, setAvailableList] = useState(available);
        const [selectedList, setSelectedList] = useState(selected);
        

        
        console.log("selected", selected, "available", available, "nameMap", nameMap)
    useEffect(() => {
        setAvailableList(available);
      
                console.log("AVAIL","selected", selected, "available", available, "nameMap", nameMap)
    }, [available]);

    useEffect(() => {
        setSelectedList(selected);
      
           console.log("SELECT","selected", selected, "available", available, "nameMap", nameMap)
    }, [selected]);

    const map = nameMap || new Map();

    const handleClick = (ID, add) => {
        
        let newAvailableList = add ? availableList.filter(item => item !== ID) : availableList.concat(ID);
        let newSelectedList = add ? selectedList.concat(ID) : selectedList.filter(item => item !== ID);
        
        setAvailableList(newAvailableList);
        setSelectedList(newSelectedList);

    };

    useImperativeHandle(ref, () => ({
        getSelectedIds: () => selectedList
    }));

    return (
        <div className='flex' style={{flexDirection: 'column'}}>
           <div style={{ display: "flex" }}>
            <h2 style={{ flex: "1", textAlign: "center" }}> 
                {availableName ? availableName : "Available Categories"}
            </h2>
            <h2 style={{ flex: "1", textAlign: "center" }}>
                {selectedName ? selectedName : "Selected Categories"}
            </h2>
            </div>
            {text && <div >
                <p style={{margin: "5px"}}>{text}</p>
            </div>}
            

            <div style={{display: 'flex'}}>
          <div className="available-categories" style={{flex: '1'}}>
             
              <div className='innerDiv' style={{height: "100%", margin: "0px 5px 5px"}}>
                  {availableList.map(id => (
                      <p className='selection-item' key={id} onClick={() => handleClick(id, true)}>{map.get(id)}</p>
                  ))}
              </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <svg version="1.0" 
 width="50px" height="50px" viewBox="0 0 512.000000 512.000000"
>

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M3638 5110 c-72 -22 -137 -88 -158 -161 -6 -19 -10 -138 -10 -266 l0
-233 -1587 -2 c-1777 -3 -1611 4 -1688 -75 -65 -67 -66 -84 -63 -600 3 -448 3
-459 25 -499 29 -54 93 -110 140 -123 26 -8 531 -11 1606 -11 l1567 0 0 -227
c0 -135 5 -244 11 -268 15 -54 100 -139 154 -154 22 -6 58 -11 80 -11 92 0
106 12 676 591 294 299 544 560 556 579 30 50 46 132 38 188 -16 109 -13 105
-608 698 -483 482 -568 562 -603 572 -47 14 -96 14 -136 2z"/>
<path d="M1335 2624 c-31 -11 -160 -135 -597 -571 -619 -619 -601 -597 -602
-728 -1 -133 -13 -119 590 -730 560 -568 576 -582 669 -593 97 -10 218 71 244
164 6 23 11 135 11 267 l0 227 1566 0 c1160 0 1577 3 1605 12 51 15 114 69
142 122 22 40 22 48 25 501 2 324 0 472 -8 500 -18 62 -55 111 -107 142 l-48
28 -1585 5 -1585 5 -5 250 c-4 186 -9 256 -19 275 -65 119 -179 167 -296 124z"/>
</g>
</svg>


                </div>

          <div className="selected-categories "  style={{flex: '1'}}>
             
              <div className='innerDiv' style={{height: "100%", margin: "0px 5px 5px"}}>
                  {selectedList.map(id => (
                      <p className='selection-item' key={id} onClick={() => handleClick(id, false)}>{map.get(id)}</p>
                  ))}
              </div>
          </div>
            </div>
            </div>
    );
});

export default SelectedAvailableBoxes;


