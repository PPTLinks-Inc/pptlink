/* eslint-disable */

import { createContext, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  presentations: number;
}

interface UserContextProps {
  user?: User;
  setUser: (user: User) => void;
}

export const userContext = createContext<UserContextProps>({
  setUser: () => {},
  user: undefined,
});

const UserContextProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [user, setUser] = useState<User>();

  return (
    <userContext.Provider value={{ user, setUser }}>
      {props.children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
