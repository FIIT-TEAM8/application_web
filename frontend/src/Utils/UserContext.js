import { createContext, useContext } from 'react';


const initialState = {
    user: {},
    accessToken: undefined,
};

export const UserContext = createContext(initialState);

export const useUser = () => useContext(UserContext);