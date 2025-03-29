import { useState, useEffect, useRef } from "react";
import React from "react";
import { typeIcons } from "./levelIcons";
import { StyleChanger } from "./../../newUtils/styleChanger";
import InputList from "../InputList"; // adjust the path as needed
import { getValue } from "../../newUtils/getValue";


import { useContentElement } from "../useContentElement";
export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {


  // Configuration for useContentData
  const contentConfig = {
    defaultData: { 
      name: "Skills", 
      color: "", 
      skills: [], // Note: Now an array with template object
      innerStyle: {
        IconSize: "height: 15px; width: 15px;",
        IconMargin: 'margin-left:0px; margin-right: 0px;',
        NameSize: 'font-size:15px;',
        SkillSize: 'font-size:15px;'
      }
    },
    innerStyleDefaults: {
      IconSize: "height: 15px; width: 15px;",
      IconMargin: 'margin-left:0px; margin-right: 0px;',
      NameSize: 'font-size:15px;',
      SkillSize: 'font-size:15px;'
    }
  };

  // Use the hook


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

  const [newSkill, setNewSkill] = useState({ name: "", level: 1, type: "star" });

  // Update element when position or resourceMeta changes
  useEffect(() => {
    setElement(resourceMeta[position]);
  }, [position, resourceMeta]);



  // Your handler functions remain largely the same
  const handleAddSkill = (field, skill) => {
    handleAddItemToArray(field, skill);
    setNewSkill({ name: "", level: 1, type: "star" });
  };






  const update = (updatedSkills) => {
    const updatedData = { ...contentData, skills: updatedSkills };
    setContentData(updatedData);
    updateElement(updatedData);
  };

  return (
    <div className="input-skills-container">
      <h3>Content Data</h3>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={contentData.name}
          onChange={(e) => deferHandleFieldChange("name", e.target.value)}
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

      <StyleChanger
        property={"font-size"}
        name={"SkillSize"}
        defaultColor={"15px"}
        type={"number"}
        inputName={"Skill name size"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
        position={position}
      />
      <StyleChanger
        property={"height"}
        additionalProperties={["width"]}
        name={"IconSize"}
        defaultColor={"11px"}
        type={"number"}
        inputName={"IconSize"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
        position={position}
      />
      <StyleChanger
        property={"margin-left"}
        name={"IconMargin"}
        defaultColor={"0px"}
        type={"number"}
        inputName={"Icon Space"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
        additionalProperties={["margin-right"]}
        position={position}
      />

      <h3>Add Skill</h3>
      <input
        type="text"
        placeholder="Skill Name"
        value={newSkill.name}
        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
      />
      <input
        type="number"
        min="1"
        max="5"
        value={newSkill.level}
        onChange={(e) =>
          setNewSkill({
            ...newSkill,
            level: Math.min(5, Math.max(1, Number(e.target.value))),
          })
        }
      />
      <select
        value={newSkill.type}
        onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
      >
        {Object.keys(typeIcons).map((key) => (
          <option key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>
      <button onClick={()=>handleAddSkill("skills", newSkill)}>Add Skill</button>

      {/* Use the InputList with a render function for custom skill rendering */}
      <InputList
        items={contentData.skills}
        update={update}
        position={position}

      >
        {({ item, index, moveItem, removeItem, handleItemChange, deferHandleItemChange}) => {
          const icons = typeIcons[item.type] || typeIcons.star;
          return (

              <div>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => deferHandleItemChange(index, "name", e.target.value)}
                />
                <div>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={item.level}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "level",
                        Math.min(5, Math.max(1, Number(e.target.value)))
                      )
                    }
                  />
                  <select
                    value={item.type}
                    onChange={(e) => handleItemChange(index, "type", e.target.value)}
                  >
                    {Object.keys(typeIcons).map((key) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <span>
                  {Array.from({ length: item.level }, (_, i) => (
                    <React.Fragment key={`filled-${index}-${i}`}>
                      {<icons.filled />}
                    </React.Fragment>
                  ))}
                  {Array.from({ length: 5 - item.level }, (_, i) => (
                    <React.Fragment key={`unfilled-${index}-${i}`}>
                      {<icons.unfilled />}
                    </React.Fragment>
                  ))}
                </span>
              </div>

          );
        }}
      </InputList>
    </div>
  );
};

export default InputElement;
