// workTimelineInputElement.js
import { useState, useEffect } from "react";
import { useContentElement } from "../useContentElement";
import InputList from "../InputList";

import { StyleChanger } from './../../newUtils/styleChanger';

export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta, isStyle }) => {
  const contentConfig = {
    defaultData: {
      title: "Work Experience",
      timeline: [],
      type: "test",
      innerStyle: {
        TitleSize: "font-size:16px;",
        Entry: "font-size:14px;",
        EntryCompany: "font-size:14px;",
        EntryRole: "font-size:14px;",
        EntryDate: "font-size:14px;",
        EntryDescription: "font-size:14px;",
        line: "font-size:5px;",
          dotSize: "width:25px; height:25px;"
      }
    },
    innerStyleDefaults: {
      TitleSize: "font-size:16px;",
      Entry: "font-size:14px;",
      EntryCompany: "font-size:14px;",
      EntryRole: "font-size:14px;",
      EntryDate: "font-size:14px;",
      EntryDescription: "font-size:14px; white-space: pre-wrap;",
          line: "font-size:5px;",
          dotSize: "width:25px; height:25px;"
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

  const [newEntry, setNewEntry] = useState({
    company: "",
    role: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    currentlyEmployed: false,
    description: ""
  });

  useEffect(() => {
    setElement(resourceMeta[position]);
  }, [position, resourceMeta]);

  const handleAddEntry = () => {
    handleAddItemToArray("timeline", newEntry);
    setNewEntry({
      company: "",
      role: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentlyEmployed: false,
      description: ""
    });
  };

  const update = (updatedTimeline) => {
    const updatedData = { ...contentData, timeline: updatedTimeline };
    setContentData(updatedData);
    updateElement(updatedData);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);


  if (!isStyle) return(
<><div className="input-timeline-container">
      <h3>Work Timeline</h3>
      <div>
        <label>Title: </label>
        <input
          type="text"
          value={contentData.title}
          onChange={(e) => deferHandleFieldChange("title", e.target.value)}
        />
      </div>



      <div>
        <label>Type: </label>
        <select
          value={contentData.type}
          onChange={(e) => handleFieldChange("type", e.target.value)}
        >
          <option value="test">Test</option>
          <option value="modern">Modern</option>
          <option value="compact">Compact</option>
          <option value="classic">Classic</option>
          <option value="borderless">Borderless</option>
          <option value="timelineTwoColumn">Two-Column Timeline</option>
          <option value="timelineInline">Inline Timeline</option>
        </select>
      </div>

      <InputList
        name="Timeline"
        items={contentData.timeline}
        update={update}
        position={position}
        addNewItem={handleAddEntry}
        collapsedItem={(item) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{item.company}</span>
            <span>{item.role}</span>
            <span>{item.startMonth}/{item.startYear} - {item.currentlyEmployed ? "Present" : `${item.endMonth}/${item.endYear}`}</span>
          </div>
        )}
      >
        {({ item, index, moveItem, removeItem, handleItemChange, deferHandleItemChange }) => (
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Company"
              value={item.company}
              onChange={(e) => deferHandleItemChange(index, "company", e.target.value)}
            />
            <input
              type="text"
              placeholder="Role"
              value={item.role}
              onChange={(e) => deferHandleItemChange(index, "role", e.target.value)}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
              
            <div>
                <label>Start Year:</label>
                <select
                  value={item.startYear}
                  onChange={(e) => handleItemChange(index, "startYear", e.target.value)}
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Start Month:</label>
                <select
                  value={item.startMonth}
                  onChange={(e) => handleItemChange(index, "startMonth", e.target.value)}
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

            </div>



            {!item.currentlyEmployed && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

                <div>
                  <label>End Year:</label>
                  <select
                    value={item.endYear}
                    onChange={(e) => handleItemChange(index, "endYear", e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>End Month:</label>
                  <select
                    value={item.endMonth}
                    onChange={(e) => handleItemChange(index, "endMonth", e.target.value)}
                  >
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
                        <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
              <input
                type="checkbox"
                id={`currently-employed-${index}`}
                checked={item.currentlyEmployed}
                onChange={(e) => handleItemChange(index, "currentlyEmployed", e.target.checked)}
              />
              <label htmlFor={`currently-employed-${index}`} style={{margin:"0px", marginLeft: "5px" }}>
                Currently Employed
              </label>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label>Description:</label>
              <textarea
                value={item.description}
                onChange={(e) => deferHandleItemChange(index, "description", e.target.value)}
                placeholder="Describe your role, achievements, etc."
                rows="4"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        )}
 </InputList>
    </div>
</>
  )
if (isStyle) return(
<>

<StyleChanger
  property={"width"}
  name={"line"}
  defaultColor={"5px"}
  type={"number"}
  inputName={"line width"}
  handleStyle={handleStyleChange}
  currentStyle={contentData.innerStyle}
  position={position}
/>




            
<StyleChanger
  property={"height"}
  additionalProperties={["width"]}
  name={"dotSize"}
  defaultColor={"25px"}
  type={"number"}
  inputName={"Dot Size"}
  handleStyle={handleStyleChange}
  currentStyle={contentData.innerStyle}
  position={position}
/>
 </>
)
    




};