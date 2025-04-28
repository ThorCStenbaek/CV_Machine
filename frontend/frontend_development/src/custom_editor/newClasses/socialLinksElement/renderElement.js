import React from "react";
import { socialIcons } from "./socialLinks";
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
    let links = [];
    let name = "";
    let innerStyle = {};

    // Parse content_data into an object and extract links and name
    try {
        let parsedData;
        if (typeof content_data === "string") {
            parsedData = JSON.parse(content_data);
        } else {
            parsedData = content_data;
        }
        if (parsedData && typeof parsedData === "object" && !Array.isArray(parsedData)) {
            links = Array.isArray(parsedData.links) ? parsedData.links : [];
            name = parsedData.name || "Social Links";
            innerStyle = parsedData.innerStyle || {};
        } else if (Array.isArray(parsedData)) {
            links = parsedData;
        }
    } catch (error) {
        console.error("Failed to parse content_data", error);
    }

    return (
        <div 
            style={{ ...style, display: "flex", flexDirection: "column" }} 
      
            onClick={onClick} 
            onMouseOver={onMouseOver} 
            onMouseOut={onMouseOut}
        >
            <h6 className="NameSize cd-name" style={{...convertStyleStringToObject(innerStyle.NameSize), marginTop: "5px", marginBottom: "10px"}}>
                {name}
            </h6>
            {links.length > 0 && (
                <div className="social-links-container">
                    {links.map((link, index) => {
                        const Icon = socialIcons[link.platform]?.icon || socialIcons.website.icon;
                        const displayText = link.text || link.platform;
                        return (
                            <a className={`item${index}`}
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                    textDecoration: "none",
                                    color: "inherit"
                                }}
                            >
                                <Icon className="IconSize IconMargin" 
                                    style={
                                        innerStyle.IconSize+innerStyle.IconMargin
                                    } 
                                />
                                <span className="LinkSize item-text" style={{
                                    ...convertStyleStringToObject(innerStyle.LinkSize)
                                }}>
                                    {displayText}
                                </span>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RenderElement    