/**
 * Adjusts the width in pixels in a given style string by a specified amount.
 * 
 * @param {string} styleString The current style string of an element.
 * @param {number} change The amount to adjust the width in pixels by. Can be positive or negative.
 * @returns {string} The updated style string with the adjusted width in pixels.
 */
function changeWidthToPx(styleString, change) {
    const regex = /width:\s*(\d+(\.\d+)?)px/;
    const match = styleString.match(regex);
    if (match) {
        // Convert the captured width value to a number and apply the change

        let newWidthPx = change;
        newWidthPx = Math.max(0, newWidthPx); // Ensure the width is not negative.
        
        // Replace the old width value in the style string with the new one
        return styleString.replace(regex, `width: ${newWidthPx}px`);
    } else {
        console.log("No matching width pattern found.");
        return styleString; // Return the original string if no width pattern is found.
    }
}

/**
 * Adjusts the height in pixels in a given style string by a specified amount.
 * 
 * @param {string} styleString The current style string of an element.
 * @param {number} change The amount to adjust the height in pixels by. Can be positive or negative.
 * @returns {string} The updated style string with the adjusted height in pixels.
 */
function changeHeightToPx(styleString, change) {
    const regex = /height:\s*(\d+(\.\d+)?)px/;
    const match = styleString.match(regex);
    if (match) {
        // Convert the captured height value to a number and apply the change

        let newHeightPx = change;
        newHeightPx = Math.max(0, newHeightPx); // Ensure the height is not negative.
        
        // Replace the old height value in the style string with the new one
        return styleString.replace(regex, `height: ${newHeightPx}px`);
    } else {
        console.log("No matching height pattern found.");
        return styleString; // Return the original string if no height pattern is found.
    }
}




/**
 * Extracts the width in pixels from a given style string.
 * 
 * @param {string} styleString The style string of an element.
 * @returns {number} The width in pixels, or null if no width in pixels is found.
 */
function getWidthInPx(styleString) {
    const regex = /width:\s*(\d+(\.\d+)?)px/;
    const match = styleString.match(regex);
    if (match) {
        return parseFloat(match[1]); // Return the width in pixels as a number
    } else {
        console.log("No matching width pattern found.");
        return null; // Return null if no width pattern is found.
    }
}

/**
 * Checks if the width in pixels specified in a style string is greater than a specified value.
 * 
 * @param {string} styleString The style string of an element.
 * @returns {boolean} True if the width in pixels is greater than the specified value, otherwise false.
 */
function isThisStanding(styleString) {
    const widthPx = getWidthInPx(styleString);
    return widthPx < 880; // Check if the width is greater than 650px
}

export { changeWidthToPx, getWidthInPx, isThisStanding, changeHeightToPx };
