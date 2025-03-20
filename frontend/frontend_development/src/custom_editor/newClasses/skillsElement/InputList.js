import React from "react";

const InputList = ({ skills, children, update }) => {
  
   
  
  
    const removeSkill = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);

  
        update(updatedSkills);
      };
    
      const moveSkill = (index, direction) => {
        const newIndex = index + direction;
        // Check boundaries: if newIndex is out of range, do nothing.
        if (newIndex < 0 || newIndex >= skills.length) {
          return;
        }
        // Create a copy of the skills array
        const updatedSkills = [...skills];
      


        [updatedSkills[index], updatedSkills[newIndex]] = [updatedSkills[newIndex], updatedSkills[index]];
     
        update(updatedSkills);
      };

      const handleSkillChange = (index, key, value) => {
        const updatedSkills = skills.map((skill, i) => {
          if (i === index) {
            return { ...skill, [key]: value };
          }
          return skill;
        });

        update(updatedSkills);
      };
  
  
    return (
    <ul style={{ listStyle: "none", paddingLeft: "0px" }}>
      {skills.map((skill, index) => (
        <li key={index}>
            <div style={{ display: "flex" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button onClick={() => moveSkill(index, -1)}>^</button>
                <button onClick={() => moveSkill(index, 1)}>v</button>
              </div>
          {children({ skill, index, moveSkill, removeSkill, handleSkillChange })}
          <button style={{ background: "red" }} onClick={() => removeSkill(index)}>
                X
              </button>
            </div>
        </li>
      ))}
    </ul>
  );
};

export default InputList;
