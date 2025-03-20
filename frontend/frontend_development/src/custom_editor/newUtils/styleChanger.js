
import { DynamicStyleEditor } from "./DynamicStyleEditor"

import React, {useState, useEffect} from "react"
export const StyleChanger = ({property, defaultColor, type, options, inputName, handleStyle, currentStyle})=>{

const [style, setStyle] = useState(currentStyle)



    useEffect(()=>{
setStyle(currentStyle)
    },[currentStyle])

    const pseudoUpdateResourceMeta=(resourceMeta)=>{

        setStyle(resourceMeta[0].specific_style)
        console.log("STYLE MOMENT:", resourceMeta[0].specific_style)
        if (!handleStyle)
            return 
        handleStyle(resourceMeta[0].specific_style)
    }
    const fakeChangeDrag = (position, p, side, property, bool) =>{
        return 
    }



    return (
        <DynamicStyleEditor position={0}
         resourceMeta={[{specific_style:style}]}
          updateResourceMeta={pseudoUpdateResourceMeta}
          property={property}
          defaultColor={defaultColor}
          type={type}
          options={options}
          inputName={inputName}
          changeDrag={fakeChangeDrag}

          />
    )
}