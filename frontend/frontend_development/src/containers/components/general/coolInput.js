import React, { useState, useEffect } from 'react';

function CoolInput({ label, onChange = (v)=>console.log(""),onChangeE=(e)=>e , type="text", name="input",value, labelColorOn='#333', labelColorOff='#aaa',  ...extraProps }) {
  const [isFocused, setFocused] = useState(false);
  const [innerValue, setValue] = useState(value || "");

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleChange = (e) => {setValue(e.target.value); onChange(e.target.value); onChangeE(e)}


  return (
    <div className="container">
      <input
        className="inputField"
        id={label}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
              value={innerValue}
              type={type}
              name={name}
              { ...extraProps}
        placeholder=" " /* Ensures :placeholder-shown works correctly */
      />
      <label
        className="label"
        htmlFor={label}
        style={{
          top: isFocused || innerValue? '-10%' : '28%',
          fontSize: isFocused || innerValue ? '12px' : '16px',
          color: isFocused ||innerValue ? labelColorOn : labelColorOff
        }}
      >
        {label}
      </label>
    </div>
  );
}

export default CoolInput;
