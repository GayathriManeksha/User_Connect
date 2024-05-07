import React, { createContext, useContext, useState } from 'react';

// Create a context
const GlobalContext = createContext();

// Custom hook to use the context
export const useGlobalContext = () => useContext(GlobalContext);

// Define the provider component
export const GlobalProvider = ({ children }) => {
    // Define the global state and functions to update it
    const [globalState, setGlobalState] = useState({
        address:'',
        online:false
    });

    const updateGlobalState = (newState) => {
        setGlobalState((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    // Pass the state and functions to the context provider
    return (
        <GlobalContext.Provider value={{ globalState,updateGlobalState}}>
            {children}
        </GlobalContext.Provider>
    );
};
