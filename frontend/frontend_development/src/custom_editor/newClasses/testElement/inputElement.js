import { useState, useEffect } from "react";

export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
  
    const [element, setElement] = useState(resourceMeta[position] || { content_data: "" });

    useEffect(() => {
        setElement(resourceMeta[position] || { content_data: "" });
    }, [resourceMeta, position]);

    const handleChange = (e) => {
        const newEl = { ...element, content_data: e.target.value };
        setElement(newEl);
        changeElement(position, newEl);
    };

    return (
        <input onChange={handleChange} type="text" value={element.content_data || ""} />
    );
};
