export const convertStyleStringToObject = (styleString) => {
    const styleObject = {};

    if (styleString) {
        const styleEntries = styleString.split(';');
        styleEntries.forEach(entry => {
            const [property, value] = entry.split(':');
            if (property && value) {
                styleObject[property.trim()] = value.trim();
            }
        });
    }

    return styleObject;
};