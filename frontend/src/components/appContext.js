// AppContext.js
import React, { createContext, useState } from 'react';

// Create a new context
const AppContext = createContext();

// Create a context provider component
const AppProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);
    const [viewId, setViewId] = useState(null);

    return (
        <AppContext.Provider value={{ name, setName, editId, setEditId, viewId, setViewId }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
