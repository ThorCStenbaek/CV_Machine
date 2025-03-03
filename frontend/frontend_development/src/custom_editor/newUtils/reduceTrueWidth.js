import { getValue, setValue } from "./getValue"

const reduceTrueWidth = (element, reductionAmount, changeStyle=false) => {
    // Start with the current style string from the element
    let style = element.specific_style

    const initalReductionIsMinus = reductionAmount < 0

    // Retrieve current values (borders remain unchanged)
    const borderLeft  = parseFloat(getValue("border-left-width", style, true))  || 0
    const borderRight = parseFloat(getValue("border-right-width", style, true)) || 0

    let marginLeft  = parseFloat(getValue("margin-left", style, true))  || 0
    let marginRight = parseFloat(getValue("margin-right", style, true)) || 0
    let paddingLeft = parseFloat(getValue("padding-left", style, true)) || 0
    let paddingRight= parseFloat(getValue("padding-right", style, true))|| 0
    let width       = parseFloat(getValue("width", style, true))       || 0

    let remaining = reductionAmount

    // Reduce in order: marginLeft, marginRight, paddingLeft, paddingRight, then width

    if (remaining > 0) {
        const reduce = Math.min(marginLeft, remaining)
        marginLeft -= reduce
        remaining -= reduce
        if (changeStyle)
            style = setValue("margin-left", marginLeft, style)
    }

    if (remaining > 0) {
        const reduce = Math.min(marginRight, remaining)
        marginRight -= reduce
        remaining -= reduce
        if (changeStyle)
            style = setValue("margin-right", marginRight, style)
    }

    if (remaining > 0) {
        const reduce = Math.min(paddingLeft, remaining)
        paddingLeft -= reduce
        remaining -= reduce
        if (changeStyle)
            style = setValue("padding-left", paddingLeft, style)
    }

    if (remaining > 0) {
        const reduce = Math.min(paddingRight, remaining)
        paddingRight -= reduce
        remaining -= reduce
        if (changeStyle)
            style = setValue("padding-right", paddingRight, style)
    }

    if (remaining > 0) {
        const reduce = Math.min(width, remaining)
        width -= reduce
        remaining -= reduce
        if (changeStyle)
            style = setValue("width", width, style)
    }

    if (initalReductionIsMinus) {
        width += (reductionAmount * -1)
        if (changeStyle)
            style = setValue("width", width, style)
    }

    // Recalculate the total true width
    const total = borderLeft + borderRight + paddingLeft + paddingRight + marginLeft + marginRight + width

    return {
        borderLeft,
        borderRight,
        marginLeft,
        marginRight,
        paddingLeft,
        paddingRight,
        width,
        total,
        style
    }
}

export default reduceTrueWidth
