import React from 'react';

const NameInitialsAvatar = ({ firstName, lastName, color, height="50px", width="50px", fontSize="20px" }) => {
  // Ensure that both firstName and lastName are defined and not empty
  const firstInitial = firstName && firstName.length > 0 ? firstName[0] : '';
  const lastInitial = lastName && lastName.length > 0 ? lastName[0] : '';

  const initials = `${firstInitial}${lastInitial}`.toUpperCase();
  const backgroundColor = color;

  const avatarStyle = {
    backgroundColor,
    width: width,
    height: height,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: fontSize,
    borderRadius: '5px' // if you want a rounded square, you can adjust the borderRadius
  };

  return (
    <div style={avatarStyle}>
      {initials}
    </div>
  );
};

export default NameInitialsAvatar;
