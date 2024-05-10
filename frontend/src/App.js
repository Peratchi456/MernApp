import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Home from './components/home';
import CreateBlog from './components/createBlog';
import ViewBlog from './components/viewBlog';
import EditBlog from './components/editblog';

import { AppProvider } from './components/appContext';

const App = () => {
    return (
        <Router>
            <AppProvider>
                <Routes>
                        <Route exact path="/home" element={<Home />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route exact path="/createblog" element={<CreateBlog />} />
                        <Route exact path="/editblog" element={<EditBlog />} />
                        <Route exact path="/viewblog" element={<ViewBlog />} />
                        <Route path="/" element={<Login />} />
                </Routes>
                </AppProvider>
        </Router>
    );
};

export default App;
