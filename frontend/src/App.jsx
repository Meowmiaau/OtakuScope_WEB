import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import GetStarted from './components/GetStarted';
import Login from './components/Login';
import Profile from './components/Profile';
import Signup from './components/Signup';
import AnimeDetails from './pages/AnimeDetails';
import Home from './pages/Home';
import ListDetails from './pages/ListDetails';
import Lists from './pages/Lists';
import Character from './components/Character';
import Staff from './components/Staff';
import Status from './components/Status';
import AllLists from './pages/AllLists';
import ListDetailsPublic from './pages/ListDetailsPublic';

const theme = createTheme({
    palette: {
        mode: 'dark', // Dark mode
        primary: {
            main: '#00f0ff', // Purple
        },
        background: {
            default: '#121212', // Dark background color
        },
    },
});

const App = () => (
    <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path="/" element={<GetStarted />} />
                <Route path="/anime/:id" element={<AnimeDetails />} />
                <Route path="/anime/:id/character" element={<Character />} />
                <Route path="/anime/:id/staff" element={<Staff />} />
                <Route path="/anime/:id/status" element={<Status />} />
                <Route path="/:id" element={<AnimeDetails />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/all-lists" element={<AllLists />} />
                <Route path="/lists/:listId" element={<ListDetails />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/public-list/:listId" element={<ListDetailsPublic />} />
                
            </Routes>
        </Router>
    </ThemeProvider>
);

export default App;
