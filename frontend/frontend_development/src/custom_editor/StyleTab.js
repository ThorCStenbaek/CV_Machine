import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import DynamicColorEditor from './newUtils/dynamicColorEditor';
import { DynamicStyleEditor } from './newUtils/DynamicStyleEditor';
import { QuadrupleDynamicStyleEditor } from './newUtils/quadrupleDynamicStyleEditor';

import { ImagePathSelector } from './../containers/components/images/ImagePathSelector';


const StyleTab = ({
  position,
  resourceMeta,
  changeElement,
  updateResourceMeta,
  CVelementInput,
  changeDrag
}) => {
  const [activeStyleTab, setActiveStyleTab] = useState('color');
  const [shouldShowContentTab, setShouldShowContentTab] = useState(false);
  const testContainerRef = useRef(document.createElement('div'));

  // Test render CVelementInput to see if it returns null
  useEffect(() => {
    if (CVelementInput) {
      // Create a test component
      const TestComponent = () => (
        <CVelementInput 
          position={position}
          resourceMeta={resourceMeta}
          changeElement={changeElement}
          updateResourceMeta={updateResourceMeta}
          isStyle={true}
        />
      );

      // Render to a detached DOM node
      ReactDOM.render(<TestComponent />, testContainerRef.current, () => {
        setShouldShowContentTab(testContainerRef.current.children.length > 0);
        ReactDOM.unmountComponentAtNode(testContainerRef.current);
      });
    } else {
      setShouldShowContentTab(false);
    }
  }, [CVelementInput, position, resourceMeta, changeElement, updateResourceMeta]);

  // Define available tabs
  const styleTabs = [
    ...(shouldShowContentTab ? [{ id: 'content', label: 'Content Style' }] : []),
    { id: 'color', label: 'Color and Background' },
    { id: 'size', label: 'Size and Shape' },
    { id: 'other', label: 'Other' }
  ];

  // If the active tab is 'content' but shouldn't be shown, switch to 'color'
  useEffect(() => {
    if (activeStyleTab === 'content' && !shouldShowContentTab) {
      setActiveStyleTab('color');
    }
  }, [shouldShowContentTab, activeStyleTab]);
  
  // Border style options
  const lineStyleOptions = [
    { text: "None", value: "none" },
    { text: "Solid", value: "solid" },
    { text: "Dashed", value: "dashed" },
    { text: "Dotted", value: "dotted" },
    { text: "Double", value: "double" },
    { text: "Groove", value: "groove" },
    { text: "Ridge", value: "ridge" },
    { text: "Inset", value: "inset" },
    { text: "Outset", value: "outset" }
  ];

        

  return (
    <>
      {/* Style Tab Navigation */}
      <div style={{ display: 'flex', marginBottom: '15px' }}>
        {styleTabs.map(tab => (
          <button
            key={tab.id}
            style={{ 
              flex: 1, 
              margin: 0, 
              borderRadius: '0px', 
              backgroundColor: activeStyleTab === tab.id ? '#0e7abd' : '#198fd9',
              padding: '8px 0'
            }}
            onClick={() => setActiveStyleTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
        {/* Content Style Tab */}
        {activeStyleTab === 'content' && CVelementInput && (
          <CVelementInput 
  position={position} 
  resourceMeta={resourceMeta} 
  changeElement={changeElement} 
  updateResourceMeta={updateResourceMeta} 
  isStyle={true}
/>
        )}

        {/* Color and Background Tab */}
        {activeStyleTab === 'color' && (
          <>
            <div className="divBreak">
              <h3 style={{ marginBottom: '0px' }}>Background Color</h3>
              <DynamicColorEditor 
                position={position} 
                resourceMeta={resourceMeta} 
                updateResourceMeta={updateResourceMeta} 
                property={"background"} 
              />
            </div>

            <div className="divBreak">
              <h3 style={{ marginBottom: '0px' }}>Font/Icon Color</h3>
              <DynamicColorEditor 
                position={position} 
                resourceMeta={resourceMeta} 
                updateResourceMeta={updateResourceMeta} 
                property={"color"} 
              />
            </div>
            {/* New Border Section */}
            <div className="divBreak">
              <h3 style={{ marginBottom: '0px' }}>Border Settings</h3>
              


              <div style={{ marginBottom: '10px' }}>
                <p>Border Color</p>
                <DynamicColorEditor
                  position={position}
                  resourceMeta={resourceMeta}
                  updateResourceMeta={updateResourceMeta}
                  property={"border-color"}
                />
              </div>

<div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ marginBottom: '10px' }}>
                <p>Border Style</p>
                <DynamicStyleEditor
                  position={position}
                  resourceMeta={resourceMeta}
                  updateResourceMeta={updateResourceMeta}
                  property={"border-style"}
                  type="select"
                  options={lineStyleOptions}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <p>Border Width (px)</p>
                <DynamicStyleEditor
                  position={position}
                  resourceMeta={resourceMeta}
                  updateResourceMeta={updateResourceMeta}
                  property={"border-top-width"}
                  additionalProperties={["border-bottom-width", "border-left-width", "border-right-width"]}
                  type="number"
                  defaultColor="0px"
                  changeDrag={changeDrag}
                />
              </div>
              </div>


            </div>

{/* Add these to the color tab */}
<div className="divBreak">
  <h3 style={{ marginBottom: '0px' }}>Background Image</h3>
  {<DynamicStyleEditor
    position={position}
    resourceMeta={resourceMeta}
    updateResourceMeta={updateResourceMeta}
    property={"background-image"}
    type="image"
    placeholder="url('...')"
    defaultColor=''
  />}
 
  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
    <DynamicStyleEditor
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"background-size"}
      type="select"
      options={[
        {text: "Cover", value: "cover"},
        {text: "Contain", value: "contain"},
        {text: "Auto", value: "auto"}
      ]}
    />
    <DynamicStyleEditor
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"background-repeat"}
      type="select"
      options={[
                {text: "Repeat", value: "repeat"},
        {text: "No Repeat", value: "no-repeat"},
        {text: "Repeat-X", value: "repeat-x"},
        {text: "Repeat-Y", value: "repeat-y"}
      ]}
    />
  </div>
</div>

            
               {/* Outline Section */}
               {/*
               <div className="divBreak">
              <h3 style={{ marginBottom: '0px' }}>Outline Settings</h3>
              
              <div style={{ marginBottom: '10px' }}>
                <p>Outline Style</p>
                <DynamicStyleEditor
                  position={position}
                  resourceMeta={resourceMeta}
                  updateResourceMeta={updateResourceMeta}
                  property={"outline-style"}
                  type="select"
                  options={lineStyleOptions}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <p>Outline Color</p>
                <DynamicColorEditor
                  position={position}
                  resourceMeta={resourceMeta}
                  updateResourceMeta={updateResourceMeta}
                  property={"outline-color"}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <p>Outline Width (px)</p>
                <DynamicStyleEditor
                  position={position}
                  resourceMeta={resourceMeta}
                  updateResourceMeta={updateResourceMeta}
                  property={"outline-width"}
                  type="number"
                  defaultColor="0px"
                />
              </div>

              <div>
                <p>Outline Offset (px)</p>
                <DynamicStyleEditor
                  position={position}
                  resourceMeta={resourceMeta}
                  updateResourceMeta={updateResourceMeta}
                  property={"outline-offset"}
                  type="number"
                  defaultColor="0px"
                />
              </div>
            </div>
            */ } 
          </>
        )}

        {/* Size and Shape Tab */}
        {activeStyleTab === 'size' && (
          <>


          {/* Add to size tab after existing controls */}
<div className="divBreak">
  <h3 style={{ marginBottom: '0px' }}>Dimensions</h3>
  <div style={{ display: 'flex', gap: '10px' }}>
    <DynamicStyleEditor
      inputName="Width"
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"width"}
      type="number"
      defaultColor="auto"
    />
    <DynamicStyleEditor
      inputName="Height"
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"height"}
      type="number"
      defaultColor="auto"
    />
  </div>
</div>





            <DynamicStyleEditor  
              inputName="FontSize" 
              alignItems="" 
              defaultColor="0px" 
              position={position} 
              resourceMeta={resourceMeta} 
              updateResourceMeta={updateResourceMeta} 
              property={"font-size"} 
              type="number" 
            />

            <div> 
              <p>Border Radius</p>
              <DynamicStyleEditor 
                defaultColor="0px" 
                position={position} 
                resourceMeta={resourceMeta} 
                updateResourceMeta={updateResourceMeta} 
                property={"border-radius"} 
                type="number" 
              />
            </div>

            <p>padding</p>
            <QuadrupleDynamicStyleEditor 
              defaultColor="0px" 
              position={position} 
              resourceMeta={resourceMeta} 
              updateResourceMeta={updateResourceMeta} 
              property={"padding-$"} 
              type="number"
              changeDrag={changeDrag}
            />

<p>margin</p>
            <QuadrupleDynamicStyleEditor 
              defaultColor="0px" 
              position={position} 
              resourceMeta={resourceMeta} 
              updateResourceMeta={updateResourceMeta} 
              property={"margin-$"} 
              type="number"
              changeDrag={changeDrag}
            />
          </>
        )}

        {/* Other Tab */}
        {activeStyleTab === 'other' && (
          <>
{/* Add to other tab */}
<div className="divBreak">
  <h3 style={{ marginBottom: '0px' }}>Visual Effects</h3>
  
  <div style={{ marginBottom: '10px' }}>
    <p>Opacity (0-1) Not working.</p>
    <DynamicStyleEditor
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"opacity"}
      type="number"
      min="0"
      max="1"
      step="0.1"
      defaultColor="1"
    />
  </div>

  <div style={{ marginBottom: '10px' }}>
    <p>Box Shadow</p>
    <DynamicStyleEditor
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"box-shadow"}
      type="text"
      placeholder="e.g. 2px 2px 5px #000"
    />
  </div>

  <div style={{ marginBottom: '10px' }}>
    <p>Blend Mode</p>
    <DynamicStyleEditor
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"mix-blend-mode"}
      type="select"
      options={[
        {text: "Normal", value: "normal"},
        {text: "Multiply", value: "multiply"},
        {text: "Screen", value: "screen"},
        {text: "Overlay", value: "overlay"}
      ]}
    />
  </div>
</div>

<div className="divBreak">
  <h3 style={{ marginBottom: '0px' }}>Typography</h3>
  
  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
    <DynamicStyleEditor
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"font-weight"}
      type="select"
      options={[
        {text: "Normal", value: "normal"},
        {text: "Bold", value: "bold"},
        {text: "Lighter", value: "lighter"}
      ]}
    />
    <DynamicStyleEditor
      position={position}
      resourceMeta={resourceMeta}
      updateResourceMeta={updateResourceMeta}
      property={"font-style"}
      type="select"
      options={[
        {text: "Normal", value: "normal"},
        {text: "Italic", value: "italic"}
      ]}
    />
  </div>

<p>LineHeight</p>

  <DynamicStyleEditor
    position={position}
    resourceMeta={resourceMeta}
    updateResourceMeta={updateResourceMeta}
    property={"line-height"}
    type="number"
    defaultColor="1.5"
    step="0.1"
  />
</div>


          </>
        )}
      </div>
    </>
  );
};

export default StyleTab;