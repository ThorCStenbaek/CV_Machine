import { startingMeta } from "./startingMeta";
import {useEffect, useState} from "react";

import { BaseButtonElement } from './../baseButtonElement';
import PictureIcon from "../../icons/imageIcon";
import { useHandleClick } from './../useHandleButtonClick';


export const ButtonElement= ({position,  resourceMeta, changeElement, updateResourceMeta  }) => {
  
    const [element, setElement] = useState(resourceMeta[position]);

    useEffect(()=>{
        setElement(resourceMeta[position])
    },[resourceMeta, position])


  const handleClick = useHandleClick(position, element, changeElement, startingMeta);


    return <>
    <BaseButtonElement Icon={PictureIcon} onClick={handleClick} name="Image"/>
  
    </>
}