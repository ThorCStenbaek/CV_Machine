/**
 * Adjusts the flex percentage in a given style string by a specified amount.
 * 
 * @param {string} styleString The current style string of an element.
 * @param {number} change The amount to adjust the flex percentage by. Can be positive or negative.
 * @returns {string} The updated style string with the adjusted flex percentage.
 */
function changeFlex(styleString, change) {
    const regex = /flex: 0 0 (\d+(\.\d+)?)%/;
    const match = styleString.match(regex);
    if (match) {
        let currentFlexPercentage = parseFloat(match[1]);
        let newFlexPercentage = currentFlexPercentage + change;
        newFlexPercentage = Math.max(0, newFlexPercentage); // Ensure the percentage is not negative.
        return styleString.replace(regex, `flex: 0 0 ${newFlexPercentage}%`);
    } else {
        console.log("No matching flex pattern found.");
        return styleString; // Return the original string if no flex pattern is found.
    }
}

export default changeFlex;