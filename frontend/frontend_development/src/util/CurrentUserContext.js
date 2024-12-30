// UserContext.js
import React from 'react';

const CurrentUserContext = React.createContext({
  user: {},
  setUser: () => {}
});

export default CurrentUserContext;
