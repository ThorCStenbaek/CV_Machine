import React from "react";
import { typeIcons } from "./levelIcons";
import { getValue } from "../../newUtils/getValue";
import { convertStyleStringToObject } from './../convertStyleStringToObject';

export const RenderElement = ({ style, className, onClick, onMouseOver, onMouseOut, editing, data, children, extraElement }) => {
  let { content_data } = data;

  let timeline = [];
  let title = "";
  let innerStyle = {};
  let type=""

  try {
    let parsedData = typeof content_data === "string" ? JSON.parse(content_data) : content_data;
    if (parsedData && typeof parsedData === "object") {
      timeline = Array.isArray(parsedData.timeline) ? parsedData.timeline : [];
      title = parsedData.title;
      innerStyle = parsedData.innerStyle || {};
      type=parsedData.type || "";
    }
  } catch (error) {
    console.error("Failed to parse content_data", error);
  }

  const formatDateRange = (entry) => {
    if (!entry.startMonth || !entry.startYear) return "";
    
    const startDate = `${entry.startMonth} ${entry.startYear}`;
    
    if (entry.currentlyEmployed) {
      return `${startDate} - Present`;
    }
    
    if (entry.endMonth && entry.endYear) {
      return `${startDate} - ${entry.endMonth} ${entry.endYear}`;
    }
    
    return startDate;
  };


  const Title= ({style}) =>        <h6 className="TitleSize cd-title" style={{...style, ...convertStyleStringToObject(innerStyle.TitleSize)}}>{title || "Work Experience"}</h6>

  const EntryWrapper = ({style, children, entry, index}) =>             <div key={index}

  className={`Entry item${index}`}
  style={{ ...style, ...convertStyleStringToObject(innerStyle.Entry) }}> {children} </div>
    const EntryCompany = ({style, company}) => <strong className="item-company EntryCompany" style={{...style, ...convertStyleStringToObject(innerStyle.EntryCompany)}}>{company}</strong>    

    const EntryDate = ({style, date}) => <span className="item-date EntryDate" style={{...style, ...convertStyleStringToObject(innerStyle.EntryDate)}}>{date}</span>

    const EntryRole = ({style, role}) => <span className="item-role EntryRole" style={{...style, ...convertStyleStringToObject(innerStyle.EntryRole)}}>{role}</span>

    const EntryDescription = ({style, description}) => <div className="item-description EntryDescription" style={{...style, ...convertStyleStringToObject(innerStyle.EntryDescription)}}>{description}</div>


    if (type==="test")
        return (
          <div 
            style={{ ...style, display: "flex", flexDirection: "column" }} 
            onClick={onClick} 
            onMouseOver={onMouseOver} 
            onMouseOut={onMouseOut}
            
          >
            <Title/>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {timeline.map((entry, index) => (
                <EntryWrapper entry={entry} key={index}
index={index} >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "4px" }}>
                      <EntryCompany company={entry.company} />
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <EntryRole role={entry.role} />
                        {entry.role && entry.company && <span>•</span>}
                        <EntryDate date={formatDateRange(entry)} />
                      </div>
                    </div>
                    {entry.description && (
                      <EntryDescription description={entry.description} />
                    )}
                  </div>
                  {index < timeline.length - 1 && <hr style={{ margin: "8px 0", opacity: 0.5 }} />}
                  </EntryWrapper> 
              ))}
            </div>
            {children}
          </div>
        );

        // Add these type cases after the test type return


        

    if (type === "modern")
        return (
          <div 
            style={{ ...style, position: "relative" }} 
            
            onClick={onClick} 
            onMouseOver={onMouseOver} 
            onMouseOut={onMouseOut}
          >
            <Title style={{ 
              marginBottom: "3rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#34495e"
            }} />
            
            <div style={{ 
              position: "relative",
              paddingLeft: "30px",
              borderLeft: "2px solid #3498db"
            }}>
              {timeline.map((entry, index) => (
                <EntryWrapper 
                  key={index}
index={index}
                  style={{
                    marginBottom: "2rem",
                    position: "relative",
                    paddingLeft: "2rem"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    left: "-38px",
                    top: "0",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#3498db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}>
                
                  </div>
                  
                  <EntryDate 
                    date={formatDateRange(entry)} 
                    style={{
                      color: "#3498db",
                      fontWeight: 500,
                      marginBottom: "0.5rem"
                    }} 
                  />
                  <EntryCompany 
                    company={entry.company} 
                    style={{
                      fontSize: "1.25rem",
                      marginBottom: "0.25rem"
                    }} 
                  />
                  <EntryRole 
                    role={entry.role} 
                    style={{
                      color: "#7f8c8d",
                      marginBottom: "0.75rem"
                    }} 
                  />
                  <EntryDescription 
                    description={entry.description} 
                    style={{
                      backgroundColor: "#f4fafe",
                      padding: "1rem",
                      borderRadius: "6px",
                      border: "1px solid #e0f0ff"
                    }} 
                  />
                </EntryWrapper>
              ))}
            </div>
            {children}
          </div>
        );

    if (type === "compact")
        return (
          <div 
            style={{ ...style }} 
            
            onClick={onClick} 
            onMouseOver={onMouseOver} 
            onMouseOut={onMouseOut}
          >
            <Title style={{ 
              fontSize: "0.9em",
              color: "#95a5a6",
              marginBottom: "1rem"
            }} />
            
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {timeline.map((entry, index) => (
                <EntryWrapper 
                  key={index}
index={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "1rem",
                    fontSize: "0.9em"
                  }}
                >
                  <EntryDate 
                    date={formatDateRange(entry)} 
                    style={{ 
                      color: "#7f8c8d",
                      textAlign: "right"
                    }} 
                  />
                  <div>
                    <div style={{ marginBottom: "0.25rem" }}>
                      <EntryCompany 
                        company={entry.company} 
                        style={{ marginRight: "0.5rem" }} 
                      />
                      {entry.role && (
                        <>
                          <span style={{ color: "#bdc3c7" }}>|</span>
                          <EntryRole 
                            role={entry.role} 
                            style={{ marginLeft: "0.5rem" }} 
                          />
                        </>
                      )}
                    </div>
                    {entry.description && (
                      <EntryDescription 
                        description={entry.description} 
                        style={{
                          color: "#95a5a6",
                          fontSize: "0.9em"
                        }} 
                      />
                    )}
                  </div>
                </EntryWrapper>
              ))}
            </div>
            {children}
          </div>
        );

        // Add these after the test type return

    if (type === "classic")
        return (
          <div 
            style={{ 
              ...style, 
              fontFamily: "'Times New Roman', serif",
              fontSize: "11pt",
              lineHeight: 1.2
            }} 
            onClick={onClick} 
            onMouseOver={onMouseOver} 
            onMouseOut={onMouseOut}
            
          >
            <Title style={{ 
              borderBottom: "1px solid #333",
              paddingBottom: "2px",
              marginBottom: "12px",
              fontSize: "13pt",
              fontWeight: "bold"
            }} />
            
            {timeline.map((entry, index) => (
              <EntryWrapper 
                key={index}
index={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr",
                  gap: "8px",
                  marginBottom: "8px",
                  pageBreakInside: "avoid"
                }}
              >
                <EntryDate 
                  date={formatDateRange(entry)} 
                  style={{
                    fontWeight: "normal",
                    color: "#444",
                    fontSize: "10pt"
                  }} 
                />
                <div>
                  <div style={{ marginBottom: "2px" }}>
                    <EntryCompany 
                      company={entry.company} 
                      style={{
                        fontWeight: "bold",
                        fontSize: "11pt",
                        marginRight: "6px"
                      }} 
                    />
                    <EntryRole 
                      role={entry.role} 
                      style={{
                        fontStyle: "italic",
                        fontSize: "11pt",
                        color: "#666"
                      }} 
                    />
                  </div>
                  {entry.description && (
                    <EntryDescription 
                      description={entry.description} 
                      style={{
                        fontSize: "10pt",
                        lineHeight: 1.3,
                        marginLeft: "8px",
                        textAlign: "justify"
                      }} 
                    />
                  )}
                </div>
              </EntryWrapper>
            ))}
            {children}
          </div>
        );



    if (type === "borderless")
        return (
          <div 
            style={{ 
              ...style, 
              fontFamily: "Arial, sans-serif",
              fontSize: "10.5pt"
            }} 
            onClick={onClick} 
            onMouseOver={onMouseOver} 
            onMouseOut={onMouseOut}
            
          >
            <Title style={{ 
              fontSize: "12pt",
              fontWeight: "bold",
              color: "#2c3e50",
              marginBottom: "14px",
              letterSpacing: "0.5px"
            }} />
            
            <div style={{ display: "grid", gap: "10px" }}>
              {timeline.map((entry, index) => (
                <EntryWrapper 
                  key={index}
index={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "10px",
                    pageBreakInside: "avoid"
                  }}
                >
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
                    <EntryDate 
                      date={formatDateRange(entry)} 
                      style={{
                        fontSize: "9.5pt",
                        color: "#95a5a6",
                        fontWeight: 500
                      }} 
                    />

                  </div>
                  <div >
                    <div style={{display: "flex", gap: "10px"}}>
                    <EntryRole 
                      role={entry.role} 
                      style={{
                        fontSize: "11pt",
                        fontWeight: 500,
                        color: "#2980b9",
                  
                      }} 
                    />
                    <strong>-</strong>
                                        <EntryCompany 
                      company={entry.company} 
                      style={{
                        fontSize: "10pt",
                        fontWeight: 600,
                        color: "#34495e",
                   
                       
                      }} 
                    />
                    </div>
                    {entry.description && (
                      <EntryDescription 
                        description={entry.description} 
                        style={{
                          fontSize: "10pt",
                          lineHeight: 1.3,
                          color: "#444"
                        }} 
                      />
                    )}
                  </div>
                </EntryWrapper>
              ))}
            </div>
            {children}
          </div>
        );



  // 2) Two-Column Timeline
if (type === "timelineTwoColumn") {
    return (
      <div
        style={{ ...style }}
        className={` two-column-timeline`}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        <Title style={{
          fontWeight: 500,
          letterSpacing: "1px",
          marginBottom: "2rem"
        }} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "150px 1fr",
          rowGap: "1.5rem",
          columnGap: "2rem"
        }}>
          {timeline.map((entry, index) => (
            <React.Fragment key={index}
index={index}>
              <EntryDate
                date={formatDateRange(entry)}
                style={{
                  textAlign: "right",
                  fontStyle: "italic",
                  color: "#777"
                }}
              />
              <EntryWrapper
              index={index}
                style={{
                  padding: "1rem",
                  backgroundColor: "#fafafa",
                  borderRadius: "6px"
                }}
              >
                <EntryRole role={entry.role} style={{ fontWeight: 600 }} />
                <EntryCompany company={entry.company} style={{
                  display: "block",
                  fontStyle: "italic",
                  marginBottom: "0.5rem",
                  color: "#444"
                }} />
                <EntryDescription description={entry.description} />
              </EntryWrapper>
            </React.Fragment>
          ))}
        </div>
        {children}
      </div>
    );
  }
// 3) Inline Timeline
if (type === "timelineInline") {
    return (
      <div
        style={{ ...style }}
        className={` inline-timeline`}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        <Title style={{
          fontWeight: 400,
          fontSize: "1.2rem",
          marginBottom: "1.5rem",
          borderLeft: "4px solid #333",
          paddingLeft: "0.75rem"
        }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {timeline.map((entry, index) => (
            <EntryWrapper
              key={index}
index={index}
              style={{
                padding: "1rem",
                border: "1px solid #e1e1e1",
                borderRadius: "4px",

                backgroundColor: entry.currentlyEmployed ? "#eef9f1" : "#fff"
              }}
            >
                <div style={{                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",}}>
              <div>
                <EntryRole role={entry.role} style={{ fontWeight: 600 }} />
                <span style={{ margin: "0 0.5rem" }}>at</span>
                <EntryCompany company={entry.company} style={{ fontStyle: "italic" }} />
              </div>
              <EntryDate
                date={formatDateRange(entry)}
                style={{ fontStyle: "italic", color: "#666" }}
              />
              </div>
                   <EntryDescription description={entry.description} />
            </EntryWrapper>
            
          ))}
          
        </div>
        {children}
      </div>
    );
  }
  // Add this after your other type-cases in RenderElement:


  
  
    
  

    

        return (<p> No type</p>)
};