import React, { useEffect, useState } from 'react';
import { getValue, setValue } from './getValue';
const allRules = ["draggable", "selectable", "newRowButton", "freeFloat"];

const ChangeRulesForElement = ({ resourceMeta, index, updateResourceMeta }) => {
  // Initialize rules directly from resourceMeta[index].rules
  const [rules, setRules] = useState(resourceMeta[index].rules);

  // Update rules when resourceMeta or index changes
  useEffect(() => {
    setRules(resourceMeta[index].rules);
    console.log("RULES?", resourceMeta[index])
  }, [resourceMeta, index]);

  // Function to handle rule changes
  const handleRuleChange = (rule) => {
    const updatedRules = { ...rules, [rule]: !rules[rule] };
    setRules(updatedRules);

    // Update the resourceMeta with the new rules
    const updatedResourceMeta = [...resourceMeta];
    updatedResourceMeta[index].rules = updatedRules;

    if (rule=="freeFloat"){
      let s=updatedResourceMeta[index].specific_style
      s = getValue("left", s) ? s : setValue("left","0px", s, true) 

      s = getValue("top", s) ? s : setValue("top","0px", s, true) 
      
      updatedResourceMeta[index].specific_style=s

    }

    updateResourceMeta(updatedResourceMeta, "changeRulesForElement");
  };

  return (
    <div>
      <h3>Change Rules for Element</h3>
      {Object.keys(rules).map((rule) => (
        <div key={rule}>
          <label>
            {rule}:
            <input
              type="checkbox"
              checked={rules[rule]}
              onChange={() => handleRuleChange(rule)}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default ChangeRulesForElement;