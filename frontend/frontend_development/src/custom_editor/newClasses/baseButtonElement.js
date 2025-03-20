

export const BaseButtonElement = ({Icon, onClick, name}) =>{

    const baseStyle = {
        display: 'flex',
        width: '75px',
        height: "75px",
        border: '1px solid rgb(0, 0, 0)',
        cursor: 'pointer',
        padding: '10px',
        boxSizing: 'border-box',
        margin: '10px',
        flexDirection: 'column',
        justifyContent: 'center',
        fill: 'grey',
        alignItems: 'center'
    };

    
    return (
        <div style={ baseStyle} onClick={onClick}>
        <Icon />
        <b>{name}</b>
    </div>
    )
}