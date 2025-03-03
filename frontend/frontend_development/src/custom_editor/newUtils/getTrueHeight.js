import { getValue } from "./getValue"

const getTrueHeight = (element) => {
    const style = element.specific_style

    const borderTop    = parseFloat(getValue("border-top-width", style, true))    || 0
    const borderBottom = parseFloat(getValue("border-bottom-width", style, true)) || 0
    const paddingTop   = parseFloat(getValue("padding-top", style, true))   || 0
    const paddingBottom= parseFloat(getValue("padding-bottom", style, true))|| 0
    const marginTop    = parseFloat(getValue("margin-top", style, true))    || 0
    const marginBottom = parseFloat(getValue("margin-bottom", style, true)) || 0
    const height       = parseFloat(getValue("height", style, true))       || 0

    const total = borderTop + borderBottom + paddingTop + paddingBottom + marginTop + marginBottom + height

    return {
        borderTop,
        borderBottom,
        paddingTop,
        paddingBottom,
        marginTop,
        marginBottom,
        height,
        total
    }
}

export default getTrueHeight
