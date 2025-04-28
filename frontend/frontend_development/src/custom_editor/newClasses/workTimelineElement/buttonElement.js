
import { useEffect, useState } from "react";

import { BaseButtonElement } from "./../baseButtonElement";
//import { TimelineIcon } from "../../icons/timelineIcon"; // You need to create or adjust an icon!
import { SkillsIcon } from "../../icons/skillsIcon";
import { startingMeta } from './startingMeta';
export const ButtonElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
    const [element, setElement] = useState(resourceMeta[position]);

    useEffect(() => {
        setElement(resourceMeta[position]);
    }, [resourceMeta, position]);

    const handleClick = () => {
        const newElement = { ...startingMeta, depth: element.depth, specific_style: element.specific_style };
        changeElement(position, newElement);
    };

    return (
        <>
            <BaseButtonElement Icon={SkillsIcon} onClick={handleClick} name="Work Timeline" />
        </>
    );
};