/* eslint-disable */

import { createContext, useState, useMemo } from 'react';

export const socketContext = createContext();

const SocketContextProvider = (props) => {
  const [sockets, setSocket] = useState(null);

  const providerSocket = useMemo(
    () => ({ sockets, setSocket }),
    [sockets, setSocket]
  );

  return (
    <socketContext.Provider value={providerSocket}>
      {props.children}
    </socketContext.Provider>
  );
};

export default SocketContextProvider;
