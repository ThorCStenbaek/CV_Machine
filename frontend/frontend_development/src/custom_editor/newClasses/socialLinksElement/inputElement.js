import { useState, useEffect } from "react";
import React from "react";
import { StyleChanger } from "./../../newUtils/styleChanger";
import InputList from "../InputList";
import { useContentElement } from "../useContentElement";
import { socialIcons } from "./socialLinks";
// Icons for different social platforms
import CoolInput from "../../../containers/components/general/coolInput";

export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
  // Configuration for useContentData
  const contentConfig = {
    defaultData: { 
      name: "Social Links", 
      links: [], // Array of social link objects
      innerStyle: {
        IconSize: "height: 25px; width: 25px;",
        IconMargin: 'margin-left:5px; margin-right: 5px;',
        NameSize: 'font-size:15px;',
        LinkSize: 'font-size:15px;'
      }
    },
    innerStyleDefaults: {
      IconSize: "height: 25px; width: 25px;",
      IconMargin: 'margin-left:5px; margin-right: 5px;',
      NameSize: 'font-size:15px;',
      LinkSize: 'font-size:15px; margin-left:5px;'
    }
  };

  const {
    setElement,
    handleFieldChange,
    deferHandleFieldChange,
    element,
    contentData,
    setContentData,
    handleNestedChange,
    handleStyleChange,
    handleAddItemToArray,
    updateElement
  } = useContentElement({
    contentConfig,
    initialElement: resourceMeta[position],
    position,
    changeElement
  });

  const [newLink, setNewLink] = useState({ 
    platform: "linkedin", 
    url: "", 
    text: "" 
  });

  // Update element when position or resourceMeta changes
  useEffect(() => {
    setElement(resourceMeta[position]);
  }, [position, resourceMeta]);

  const handleAddLink = (field, link) => {
    handleAddItemToArray(field, link);
    setNewLink({ platform: "linkedin", url: "", text: "" });
  };
  
  const addBlankLink = () => {
    handleAddItemToArray("links", newLink);
  };


  const update = (updatedLinks) => {
    const updatedData = { ...contentData, links: updatedLinks };
    setContentData(updatedData);
    updateElement(updatedData);
  };

  return (
    <div className="input-social-links-container">
      <h3>Social Links</h3>
      <div>

        <CoolInput
          type="text"
          value={contentData.name}
          onChange={(e) => deferHandleFieldChange("name", e)}
          label={"Section Name"}
        />
        <StyleChanger
          property={"font-size"}
          name={"NameSize"}
          defaultColor={"15px"}
          type={"number"}
          inputName={"Title Size"}
          handleStyle={handleStyleChange}
          currentStyle={contentData.innerStyle}
          position={position}
        />
      </div>



      <InputList
        name="Links"
        items={contentData.links}
        update={update}
        addNewItem={addBlankLink}
        position={position}
        collapsedItem ={(item) => {
          const Icon = socialIcons[item.platform]?.icon || socialIcons.website.icon;
          return(
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon />
            <span style={{ marginLeft: '5px' }}>
              {item.text || item.platform}
            </span>
          </div>)}}
      >
        {({ item, index, moveItem, removeItem, handleItemChange, deferHandleItemChange }) => {
          const Icon = socialIcons[item.platform]?.icon || socialIcons.website.icon;
          return (
            <div>
              <select
                value={item.platform}
                onChange={(e) => handleItemChange(index, "platform", e.target.value)}
              >
                {Object.keys(socialIcons).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
              <CoolInput
                type="text"
                value={item.url}
                onChange={(v) => deferHandleItemChange(index, "url", v)}
                label="URL"
              />
              <CoolInput
                type="text"
                value={item.text}
                onChange={(v) => deferHandleItemChange(index, "text", v)}
                label="Display Text"
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon />
                <span style={{ marginLeft: '5px' }}>
                  {item.text || item.platform}
                </span>
              </div>
            </div>
          );
        }}
      </InputList>
      
      <StyleChanger
        property={"font-size"}
        name={"LinkSize"}
        defaultColor={"15px"}
        type={"number"}
        inputName={"Link text size"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
        position={position}
      />
            <StyleChanger
        property={"margin-left"}
        name={"LinkSize"}
        defaultColor={"5px"}
        type={"number"}
        inputName={"space between icon and text"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
        //additionalProperties={["margin-right"]}
        position={position}
      />
      <StyleChanger
        property={"height"}
        additionalProperties={["width"]}
        name={"IconSize"}
        defaultColor={"25px"}
        type={"number"}
        inputName={"Icon Size"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
        position={position}
      />
      <StyleChanger
        property={"margin-left"}
        name={"IconMargin"}
        defaultColor={"5px"}
        type={"number"}
        inputName={"Icon Space"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
        //additionalProperties={["margin-right"]}
        position={position}
      />
    </div>
  );
};

export default InputElement