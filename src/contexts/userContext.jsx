/* eslint-disable */

import { createContext, useState } from 'react';

export const userContext = createContext();

const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {props.children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
