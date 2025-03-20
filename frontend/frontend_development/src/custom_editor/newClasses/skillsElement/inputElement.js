import { useState, useEffect } from "react";
import React from "react";
import { typeIcons } from "./levelIcons";
import { StyleChanger } from "./../../newUtils/styleChanger";
import InputList from "./InputList"; // adjust the path as needed

export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
  const [element, setElement] = useState(resourceMeta[position]);
  const [contentData, setContentData] = useState({ name: "", color: "", skills: [] });
  const [newSkill, setNewSkill] = useState({ name: "", level: 1, type: "star" });

  useEffect(() => {
    try {
      let data;
      if (typeof element.content_data === "string") {
        data = JSON.parse(element.content_data);
      } else {
        data = element.content_data;
      }
      if (typeof data !== "object" || data === null) {
        data = { name: "", color: "", skills: [] };
      } else {
        if (!data.hasOwnProperty("name")) data.name = "";
        if (!Array.isArray(data.skills)) data.skills = [];
        if (!data.hasOwnProperty("innerStyle"))
          data.innerStyle = "IconSize: 15px; IconMargin: 0px; NameSize: 15px; SkillSize: 15px;";
        data.skills = data.skills.map(skill => {
          if (!skill.hasOwnProperty("type")) {
            return { ...skill, type: "star" };
          }
          return skill;
        });
      }
      console.log("DATA TIME:", data)
      setContentData(data);
    } catch (error) {
      console.error("Failed to parse content_data", error);
    }
  }, [position, element.content_data]);

  const updateElement = (updatedData) => {
    const newElement = { ...element, content_data: JSON.stringify(updatedData) };
    setElement(newElement);
    changeElement(position, newElement);
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() === "") return;
    const updatedSkills = [...contentData.skills, newSkill];
    const updatedData = { ...contentData, skills: updatedSkills };
    setContentData(updatedData);
    updateElement(updatedData);
    setNewSkill({ name: "", level: 1, type: "star" });
  };



  const handleFieldChange = (field, value) => {
    const updatedData = { ...contentData, [field]: value };
    setContentData(updatedData);
    updateElement(updatedData);
  };

  const handleStyleChange = (style) => {
    const updatedData = { ...contentData, innerStyle: style };
    setContentData(updatedData);
    updateElement(updatedData);
  };

  const update =(updatedSkills)=>{
    const updatedData = { ...contentData, skills: updatedSkills };
    setContentData(updatedData);
    updateElement(updatedData);
  }

  return (
    <div className="input-skills-container">
      <h3>Content Data</h3>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={contentData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
        <StyleChanger
          property={"NameSize"}
          defaultColor={"15px"}
          type={"number"}
          inputName={"Title Size"}
          handleStyle={handleStyleChange}
          currentStyle={contentData.innerStyle}
        />
      </div>

      <StyleChanger
        property={"SkillSize"}
        defaultColor={"15px"}
        type={"number"}
        inputName={"Skill name size"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
      />
      <StyleChanger
        property={"IconSize"}
        defaultColor={"15px"}
        type={"number"}
        inputName={"IconSize"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
      />
      <StyleChanger
        property={"IconMargin"}
        defaultColor={"0px"}
        type={"number"}
        inputName={"Icon Space"}
        handleStyle={handleStyleChange}
        currentStyle={contentData.innerStyle}
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
      <button onClick={handleAddSkill}>Add Skill</button>

      {/* Use the InputList with a render function for custom skill rendering */}
      <InputList
        skills={contentData.skills}
        update={update}
      >
        {({ skill, index, moveSkill, removeSkill, handleSkillChange }) => {
          const icons = typeIcons[skill.type] || typeIcons.star;
          return (

              <div>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                />
                <div>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skill.level}
                    onChange={(e) =>
                      handleSkillChange(
                        index,
                        "level",
                        Math.min(5, Math.max(1, Number(e.target.value)))
                      )
                    }
                  />
                  <select
                    value={skill.type}
                    onChange={(e) => handleSkillChange(index, "type", e.target.value)}
                  >
                    {Object.keys(typeIcons).map((key) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <span>
                  {Array.from({ length: skill.level }, (_, i) => (
                    <React.Fragment key={`filled-${index}-${i}`}>
                      {<icons.filled />}
                    </React.Fragment>
                  ))}
                  {Array.from({ length: 5 - skill.level }, (_, i) => (
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
