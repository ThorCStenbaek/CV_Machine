import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import createMetaObjects from './metaObjects';
import ElementBuilder from '../containers/components/elementBuilder';


const ElementBuilderWrapper = ({ editorChildren, imageMap }) => {
    const [resourceMeta, setResourceMeta] = useState([]);

    useEffect(() => {
        // Ensure both editorChildren and imageMap are available
        if (editorChildren && imageMap) {
            const metaObjects = createMetaObjects(editorChildren, imageMap);
            setResourceMeta(metaObjects);
        }
    }, [editorChildren, imageMap]); // Dependency array to re-run effect when these values change

    return (
        <ElementBuilder jsonData={resourceMeta} />
    );
}


export default ElementBuilderWrapper;