import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import About from './pages/About';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Header from './components/Header';


export default function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/about' element={<About />}/>
      <Route path='/sign-up' element={<SignUp />}/>
      <Route path='/sign-in' element={<SignIn />}/>
      <Route path='/profile' element={<Profile />}/>
    </Routes>
    </BrowserRouter>
  );
}
