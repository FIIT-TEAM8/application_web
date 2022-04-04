import { createContext, useContext } from 'react';


const initialState = {
    username: {}
};

export const UserContext = createContext(initialState);

export const useUser = () => useContext(UserContext);