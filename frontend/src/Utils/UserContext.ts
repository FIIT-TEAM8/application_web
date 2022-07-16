import { createContext, useContext } from 'react';
import { User } from './Interfaces';

const initialUserState: User = {
    username: {},
    articlesInReport: [],
    reportId: 0,
};

export const UserContext = createContext(initialUserState);

export const useUser = () => useContext(UserContext);