import { getValue, setValue } from "./getValue"

const reduceTrueHeight = (element, reductionAmount, changeStyle=false) => {
    // Start with the current style string from the element
    let style = element.specific_style

    const initalReductionIsMinus= reductionAmount<0

    // Retrieve current values (borders remain unchanged)
    const borderTop    = parseFloat(getValue("border-top-width", style, true))    || 0
    const borderBottom = parseFloat(getValue("border-bottom-width", style, true)) || 0

    let marginTop     = parseFloat(getValue("margin-top", style, true))     || 0
    let marginBottom  = parseFloat(getValue("margin-bottom", style, true))  || 0
    let paddingTop    = parseFloat(getValue("padding-top", style, true))    || 0
    let paddingBottom = parseFloat(getValue("padding-bottom", style, true)) || 0
    let height        = parseFloat(getValue("height", style, true))         || 0

    let remaining = reductionAmount

    // Reduce in order: marginTop, marginBottom, paddingTop, paddingBottom, then height

    if (remaining > 0) {
        const reduce = Math.min(marginTop, remaining)
        marginTop -= reduce
        remaining -= reduce
        if (changeStyle)
        style = setValue("margin-top", marginTop, style)
    }

    if (remaining > 0) {
        const reduce = Math.min(marginBottom, remaining)
        marginBottom -= reduce
        remaining -= reduce
        if (changeStyle)
        style = setValue("margin-bottom", marginBottom, style)
    }

    if (remaining > 0) {
        const reduce = Math.min(paddingTop, remaining)
        paddingTop -= reduce
        remaining -= reduce
        if (changeStyle)
        style = setValue("padding-top", paddingTop, style)
    }

    if (remaining > 0) {
        const reduce = Math.min(paddingBottom, remaining)
        paddingBottom -= reduce
        remaining -= reduce
        if (changeStyle)
        style = setValue("padding-bottom", paddingBottom, style)
    }

    if (remaining > 0) {
        const reduce = Math.min(height, remaining)
        height -= reduce
        remaining -= reduce
        if (changeStyle)
        style = setValue("height", height, style)
    }

    if (initalReductionIsMinus){
        height+=(reductionAmount*-1)
        if (changeStyle)
            style =setValue("height", height, style)
    }

    // Recalculate the total true height
    const total = borderTop + borderBottom + paddingTop + paddingBottom + marginTop + marginBottom + height

    return {
        borderTop,
        borderBottom,
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        height,
        total,
        style
    }
}

export default reduceTrueHeight
