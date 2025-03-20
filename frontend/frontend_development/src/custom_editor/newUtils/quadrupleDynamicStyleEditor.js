import { DynamicStyleEditor } from "./DynamicStyleEditor";


export const QuadrupleDynamicStyleEditor = ({position, resourceMeta, updateResourceMeta, property, type, propertyAndName=[{property:"top", name:"Top"}, {property:"bottom", name:"Bottom"}, {property:"left", name:"Left"}, {property:"right", name:"Right"}],defaultColor, changeDrag})=>{

    return(
        <>
        <div style={{display:'flex', gap: "5px"}}>
{propertyAndName.map(s=>
        <DynamicStyleEditor position={position} resourceMeta={resourceMeta} updateResourceMeta={updateResourceMeta}
        type={type} defaultColor={defaultColor}
        property={property.replace("$", s.property)} inputName={s.name} changeDrag={changeDrag} />
    )}
    </div>
    </>
    )
}