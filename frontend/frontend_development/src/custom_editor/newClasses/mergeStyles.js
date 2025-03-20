export function mergeStyles(style1, style2) {
    const parseStyles = (styleString) => {
        return styleString.split(';').reduce((acc, rule) => {
            const [property, value] = rule.split(':').map(s => s.trim());
            if (property) acc[property] = value;
            return acc;
        }, {});
    };

    const styles1 = parseStyles(style1);
    const styles2 = parseStyles(style2);

    // Merge the two objects, giving precedence to styles2
    const mergedStyles = { ...styles1, ...styles2 };

    return Object.entries(mergedStyles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
}