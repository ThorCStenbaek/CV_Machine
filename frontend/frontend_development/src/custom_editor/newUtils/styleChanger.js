
import { DynamicStyleEditor } from "./DynamicStyleEditor"
import { parseStyleString } from "../newClasses/parseStyleString";
import React, {useState, useEffect, useRef} from "react"
import { getValue } from "./getValue";
export const StyleChanger = ({property, defaultColor, type, options, inputName, handleStyle, currentStyle, name, additionalProperties, position})=>{

defaultColor="17px;"

      const updateTimeoutRef = useRef(null);
const [style, setStyle] = useState(typeof currentStyle !="string" && currentStyle ?currentStyle[name] : "")



    useEffect(()=>{
setStyle(typeof currentStyle !="string" && currentStyle ?currentStyle[name] : "")
    },[currentStyle])

    const pseudoUpdateResourceMeta=(resourceMeta)=>{

        setStyle(resourceMeta[0].specific_style)
      
        if (!handleStyle)
            return 

        const elements=document.querySelectorAll(`.position${position} .${name}`)
    
        const styleArray= parseStyleString(style)
        elements.forEach(e=>{
          const classNames= e.classList
          styleArray.forEach(s=>{
            if (!classNames.contains(`${name}-not-${s.property}`))

            e.style[s.property]=s.value
          })
        })

deferUpdateElement(name,resourceMeta[0].specific_style)
    
    }

    const deferUpdateElement = (name, style) => {
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
    
        updateTimeoutRef.current = setTimeout(() => {
            handleStyle(name,style)
          updateTimeoutRef.current = null;
        }, 500);
      };


      const handleHover=()=>{
        const elements=document.querySelectorAll(`.position${position} .${name}`)
    
        elements.forEach(e=>{
          e.style.outline="1px solid red"
        })
      }
      const handleLeave=()=>{
        const elements=document.querySelectorAll(`.position${position} .${name}`)
    
        elements.forEach(e=>{
          e.style.outline="none"
        })
      }

    const fakeChangeDrag = (position, p, side, property, bool) =>{
        return 
    }


   return (
    <div onMouseEnter={handleHover} onMouseLeave={handleLeave}>
        <DynamicStyleEditor position={0}
         resourceMeta={[{specific_style:style}]}
          updateResourceMeta={pseudoUpdateResourceMeta}
          property={property}
          defaultColor={style && getValue(property,style) ? getValue(property,style) : getValue(property,style)}
          type={type}
          options={options}
          inputName={inputName}
          changeDrag={fakeChangeDrag}
          additionalProperties={additionalProperties}
          deferUpdate={false}
          alignItems="flex-start"

          />
          </div>
    )
}