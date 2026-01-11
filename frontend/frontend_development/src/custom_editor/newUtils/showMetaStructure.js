import { CVElements } from "../newClasses/CVElements";

export const ShowMetaStructure = ({ resourceMeta , changeIndex, index}) => {
    const position=index
    const changeBg = (index) => {
      console.log("INDEX:", index);
      document.querySelector(`.structurePosition${index}`).style.background="rgba(0, 255, 225, 0.3)"
      document.querySelector(`.position${index}`).classList.add("meta-selected");
    };

    const iconMap=CVElements.getButtonMap()
  
    const setToInitial = (index) => {
          document.querySelector(`.structurePosition${index}`).style.background="initial"
      document.querySelector(`.position${index}`).classList.remove("meta-selected");
    };
  
    return (
      <div style={{ overflow: "auto", maxHeight:"100%" }}>
        {resourceMeta.map((m, index) => 
        
     

        {
             const IconElement= iconMap.get(m.instruction)
             console.log("what is Icon Element:", IconElement, iconMap, m.instruction)
          return(
          <div
            key={index} // Add a key for React's reconciliation
            className={`structurePosition${index}`} // Add a class for targeting
            onMouseEnter={() => changeBg(index)}
            onMouseLeave={() => setToInitial(index)}
            onClick= {()=>changeIndex(index)}
            style={{ display: "flex", alignItems: "center", border: position==index ? "solid 2px blue" : "" }} // Use flexbox for alignment
          >
            {/* Render indentation based on depth */}
            <span style={{ whiteSpace: "pre" }}>
              {"\u00A0".repeat(m.depth * 4)} {/* Use non-breaking spaces for indentation */}
            </span>
            {/* Render the content */}

            {IconElement!= undefined &&<IconElement position={0}
          resourceMeta={[{depth:1}]} changeElement={()=>{}} updateResourceMeta={(e)=>{}} />
        }
            <p>
                  
              {m.depth} - {m.instruction}
            </p>
          </div>
        )})}
      </div>
    );
  };