import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GetStarted from './components/GetStarted';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import MyAnime from './components/MyAnime';
import Lists from './components/Lists';
import Profile from './components/Profile';
import Forum from './components/Forum';
import AnimeDetails from './pages/AnimeDetails';

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
                <Route path="/:id" element={<AnimeDetails />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/myanime" element={<MyAnime />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/forum" element={<Forum />} />
            </Routes>
        </Router>
    </ThemeProvider>
);

export default App;
