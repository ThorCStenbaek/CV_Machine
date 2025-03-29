import React from "react";
import { typeIcons } from "./levelIcons";
import { getValue } from "../../newUtils/getValue";
import { convertStyleStringToObject } from './../convertStyleStringToObject';

export const RenderElement = ({ 
    style, 
    className, 
    onClick, 
    onMouseOver, 
    onMouseOut, 
    editing, 
    data, 
    children, 
    extraElement 
}) => {
    let { html_element, path, content_data, class_name, number_of_children, instruction } = data;
    let skills = [];

    let name = "";

    let innerStyle={}

    // Parse content_data into an object and extract skills and name
    try {
        let parsedData;
        if (typeof content_data === "string") {
            parsedData = JSON.parse(content_data);
        } else {
            parsedData = content_data;
        }
        if (parsedData && typeof parsedData === "object" && !Array.isArray(parsedData)) {
            skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
            name = parsedData.name;
            innerStyle=parsedData.innerStyle

            console.log("WHAT IS SIZE?",parsedData.innerStyle)
        } else if (Array.isArray(parsedData)) {
            skills = parsedData;
        }
    } catch (error) {
        console.error("Failed to parse content_data", error);
    }

    return (
        <div 
            style={{ ...style, display: "flex", flexDirection: "column", alignItems: "center" }} 
            
            onClick={onClick} 
            onMouseOver={onMouseOver} 
            onMouseOut={onMouseOut}
        >
            <h6 className="NameSize cd-name" style={{...convertStyleStringToObject(innerStyle.NameSize), marginTop: "5px", marginBottom: "5px"}}>{name|| "Skills"}</h6>
            {skills.length > 0 && (
                <div className="skills-container">
                    {skills.map((skill, index) => {
                        const icons = typeIcons[skill.type] || typeIcons.star;
                        return (
                            <div 
                                key={index} 
                                className={`item${index}`}
                                style={{ display: "flex", flexDirection:"column", alignItems: "center" }}
                            >
                                <span className="SkillSize item-name" style={{...convertStyleStringToObject(innerStyle.SkillSize)}}>{skill.name }</span>
                                <span style={{fontSize:"inherit"}} className="skill-level">
                                    {Array.from({ length: skill.level }, (_, i) => (
                                        <React.Fragment key={`filled-${index}-${i}`}>
                                            {<icons.filled className={"IconSize IconMargin"} style={innerStyle.IconSize+innerStyle.IconMargin}/>}
                                        </React.Fragment>
                                    ))}
                                    {Array.from({ length: 5 - skill.level }, (_, i) => (
                                        <React.Fragment key={`unfilled-${index}-${i}`}>
                                            {<icons.unfilled className={"IconSize IconMargin"} style={innerStyle.IconSize+innerStyle.IconMargin} />}
                                        </React.Fragment>
                                    ))}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RenderElement;
