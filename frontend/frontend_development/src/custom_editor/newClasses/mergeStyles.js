export function mergeStyles(style1, style2) {
    const parseStyles = (styleString) => {
        if (!styleString) return {};
        return styleString.split(';')
            .map(rule => rule.trim())
            .filter(rule => rule)  // remove empty rules
            .reduce((acc, rule) => {
                const colonIndex = rule.indexOf(':');
                if (colonIndex === -1) return acc;
                const property = rule.substring(0, colonIndex).trim();
                const value = rule.substring(colonIndex + 1).trim();
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
        .join('; ')+";"
}