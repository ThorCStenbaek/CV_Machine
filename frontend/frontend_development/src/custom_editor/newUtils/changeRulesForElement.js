import React, { useState } from 'react';

const allRules = ["draggable", "selectable", "newRowButton"];

const ChangeRulesForElement = ({ resourceMeta, index, updateResourceMeta }) => {
  const elementRules = resourceMeta[index].rules;

  // State to manage the current rules
  const [rules, setRules] = useState(elementRules);

  // Function to handle rule changes
  const handleRuleChange = (rule) => {
    const updatedRules = { ...rules, [rule]: !rules[rule] };
    setRules(updatedRules);

    // Update the resourceMeta with the new rules
    const updatedResourceMeta = [...resourceMeta];
    updatedResourceMeta[index].rules = updatedRules;
    updateResourceMeta(updatedResourceMeta);
  };

  return (
    <div>
      <h3>Change Rules for Element</h3>
      {allRules.map((rule) => (
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