import React, { useState, useEffect } from 'react';


/*
function CoolInput({ label, onChange = (v)=>console.log(""),onChangeE=(e)=>e , type="text", name="input",value, labelColorOn='#333', labelColorOff='#aaa',  ...extraProps }) {
  const [isFocused, setFocused] = useState(false);
  const [innerValue, setValue] = useState(value || "");

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleChange = (e) => {setValue(e.target.value); onChange(e.target.value); onChangeE(e)}

  useEffect(()=>{
    setValue(value)
  },[value])

  return (
    <div className="container">
      <input
      
      style={{background: "aliceblue", border: "none", borderBottom: "2px solid #ccc"}}
        className="inputField"
        id={label}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
              value={innerValue}
              type={type}
              name={name}
              { ...extraProps}
        placeholder=" " 
      />
      <label
        className="label"
        htmlFor={label}
        style={{
          top: isFocused || innerValue? '-20%' : '28%',
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

*/


function FloatingInput({ 
  label, 
  onChange = (v) => console.log(""), 
  type = "text", 
  name = "input",
  value,
  primaryColor = '#6200ee',
  backgroundColor = 'transparent',
  ...props 
}) {
  const [isFocused, setFocused] = useState(false);
  const [innerValue, setValue] = useState(value || "");

  useEffect(() => setValue(value), [value]);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div style={{ 
      position: 'relative', 
      paddingTop: '18px',
      marginBottom: '24px'
    }}>
      <input
        style={{
          width: '100%',
          border: 'none',
          borderBottom: `2px solid ${isFocused ? primaryColor : '#ccc'}`,
          fontSize: '16px',
          padding: '8px 0',
          outline: 'none',
          backgroundColor: backgroundColor,
          transition: 'border-color 0.3s ease'
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        value={innerValue}
        type={type}
        name={name}
        {...props}
      />
      <label
        style={{
          position: 'absolute',
          left: '0',
          top: innerValue || isFocused ? '0' : '50%',
          transform: innerValue || isFocused ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: innerValue || isFocused ? '12px' : '16px',
          color: isFocused ? primaryColor : '#666',
          transition: 'all 0.3s ease',
          pointerEvents: 'none'
        }}
      >
        {label}
      </label>
      <div style={{
        height: '2px',
        backgroundColor: primaryColor,
        transform: isFocused ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.3s ease',
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0'
      }} />
    </div>
  );
}


function OutlineInput({
  label,
  onChange = (v) => console.log(""),
  type = "text",
  name = "input",
  value,
  borderColor = '#ddd',
  focusColor = '#0066ff',
  ...props
}) {
  const [isFocused, setFocused] = useState(false);
  const [innerValue, setValue] = useState(value || "");

  useEffect(() => setValue(value), [value]);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div style={{ position: 'relative', margin: '16px 0', marginTop: "45px" }}>
      <input
        style={{
          width: '100%',
          border: `1px solid ${isFocused ? focusColor : borderColor}`,
          borderRadius: '4px',
          fontSize: '16px',
          padding: '12px',
          outline: 'none',
          transition: 'border-color 0.3s ease',
          boxSizing: 'border-box'
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        value={innerValue}
        type={type}
        name={name}
        placeholder=" "
        {...props}
      />
      <label
        style={{
          position: 'absolute',
          //left: innerValue || isFocused ?'2px' :'12px',
          top: innerValue || isFocused ? '-50px' : '-50px',
          fontSize: innerValue || isFocused ? '18px' : '18px',
          color: isFocused ? focusColor : '#666',
          padding: '0 4px',
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          fontWeight: 'bold'

        }}
      >
        {label}
      </label>
    </div>
  );
}





const CoolInput=OutlineInput
export default CoolInput;
