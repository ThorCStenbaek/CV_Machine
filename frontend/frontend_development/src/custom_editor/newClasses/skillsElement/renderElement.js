import React from "react";
import { typeIcons } from "./levelIcons";
import { getValue } from "../../newUtils/getValue";
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
    let IconSize =""
    let name = "";
    let iconMargin=""
    let nameSize="15px"
    let skillSize="10px"

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
            IconSize =  getValue("IconSize",parsedData.innerStyle,true)
            iconMargin=getValue("IconMargin", parsedData.innerStyle, true)

            nameSize=getValue("NameSize", parsedData.innerStyle)
            skillSize=getValue("SkillSize", parsedData.innerStyle)

            console.log("WHAT IS SIZE?",parsedData.innerStyle, IconSize, iconMargin)
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
            <h6 className="NameSize" style={{ marginTop: "5px", marginBottom: "5px", fontSize: nameSize }}>{name}</h6>
            {skills.length > 0 && (
                <div className="skills-container">
                    {skills.map((skill, index) => {
                        const icons = typeIcons[skill.type] || typeIcons.star;
                        return (
                            <div 
                                key={index} 
                                className="skill" 
                                style={{ display: "flex", flexDirection:"column", alignItems: "center" }}
                            >
                                <span className="skill-name" style={{fontSize:skillSize}}>{skill.name}</span>
                                <span style={{fontSize:"inherit"}} className="skill-level">
                                    {Array.from({ length: skill.level }, (_, i) => (
                                        <React.Fragment key={`filled-${index}-${i}`}>
                                            {<icons.filled size={IconSize} margin={iconMargin}/>}
                                        </React.Fragment>
                                    ))}
                                    {Array.from({ length: 5 - skill.level }, (_, i) => (
                                        <React.Fragment key={`unfilled-${index}-${i}`}>
                                            {<icons.unfilled size={IconSize} margin={iconMargin} />}
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
