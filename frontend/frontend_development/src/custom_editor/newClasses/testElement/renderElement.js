
export const RenderElement = ({style, className, onClick, onMouseOver, onMouseOut, editing, data, children, extraElement})=>{

    let { html_element, path, content_data, specific_style, class_name, number_of_children } = data;

    return <p>{content_data}</p>
}