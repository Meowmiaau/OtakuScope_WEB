import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Forum from './components/Forum';
import GetStarted from './components/GetStarted';
import Login from './components/Login';
import MyAnime from './components/MyAnime';
import Profile from './components/Profile';
import Signup from './components/Signup';
import AnimeDetails from './pages/AnimeDetails';
import Home from './pages/Home';
import ListDetails from './pages/ListDetails';
import Lists from './pages/Lists';
import Character from './components/Character';
import Staff from './components/Staff';
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
                <Route path="/:id" element={<AnimeDetails />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/myanime" element={<MyAnime />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/lists/:listId" element={<ListDetails />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/forum" element={<Forum />} />
            </Routes>
        </Router>
    </ThemeProvider>
);

export default App;
