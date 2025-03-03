import { getValue } from "./getValue"

const getTrueWidth = (element) => {
    const style = element.specific_style

    const borderLeft  = parseFloat(getValue("border-left", style, true))  || 0
    const borderRight = parseFloat(getValue("border-right", style, true)) || 0
    const paddingLeft = parseFloat(getValue("padding-left", style, true)) || 0
    const paddingRight= parseFloat(getValue("padding-right", style, true))|| 0
    const marginLeft  = parseFloat(getValue("margin-left", style, true))  || 0
    const marginRight = parseFloat(getValue("margin-right", style, true)) || 0
    const width  = parseFloat(getValue("width", style, true)) || 0

    const total = borderLeft + borderRight + paddingLeft + paddingRight + marginLeft + marginRight+width

    return {
        borderLeft,
        borderRight,
        paddingLeft,
        paddingRight,
        marginLeft,
        marginRight,
        width, 
        total
    }
}

export default getTrueWidth
