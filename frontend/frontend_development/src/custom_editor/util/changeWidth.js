/**
 * Adjusts the width percentage in a given style string by a specified amount.
 * 
 * @param {string} styleString The current style string of an element.
 * @param {number} change The amount to adjust the width percentage by. Can be positive or negative.
 * @returns {string} The updated style string with the adjusted width percentage.
 */
function changeWidth(styleString, change) {
    const regex = /width:\s*(\d+(\.\d+)?)%/;
    const match = styleString.match(regex);
    if (match) {
        let currentWidthPercentage = parseFloat(match[1]);
        let newWidthPercentage = currentWidthPercentage + change;
        newWidthPercentage = Math.max(0, newWidthPercentage); // Ensure the percentage is not negative.
        return styleString.replace(regex, `width: ${newWidthPercentage}%`);
    } else {
        console.log("No matching width pattern found.");
        return styleString; // Return the original string if no width pattern is found.
    }
}

export default changeWidth;
