import { startingMeta } from "./startingMeta";
import {useEffect, useState} from "react";

import { BaseButtonElement } from './../baseButtonElement';
import TextIcon from "../../icons/textIcon";
import { mergeStyles } from "../mergeStyles";


import { useHandleClick } from './../useHandleButtonClick';
export const ButtonElement= ({position,  resourceMeta, changeElement, updateResourceMeta  }) => {
  
    const [element, setElement] = useState(resourceMeta[position]);

    useEffect(()=>{
        setElement(resourceMeta[position])
    },[resourceMeta, position])


  const handleClick = useHandleClick(position, element, changeElement, startingMeta);


    return <>
    <BaseButtonElement Icon={TextIcon} onClick={handleClick} name="Text"/>
  
    </>
}