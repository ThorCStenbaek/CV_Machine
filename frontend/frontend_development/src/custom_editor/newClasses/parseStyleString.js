export const parseStyleString = (style) => {
    return style
      .split(";")
      .map(rule => rule.trim())
      .filter(rule => rule.length > 0)
      .map(rule => {
        const [property, value] = rule.split(":").map(part => part.trim());
        return { property, value };
      });
  };
  