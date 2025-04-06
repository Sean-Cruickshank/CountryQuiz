import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

import Home from './components/Home';
import PlayGame from './components/PlayGame';
import GameOver from './components/GameOver';
import Profile from './components/Profile';
import Layout from './components/Layout';

import '../main.css'
export default function App() {
  
  const [countryData, setCountryData] = React.useState([])

  React.useEffect(() => {
      fetch('https://restcountries.com/v3.1/independent?status=true')
      .then(response => {
        console.log('API data retrieved...')
        if (!response.ok) {
          throw new Error("Could not fetch resource");
        }
        return response.json()
      })
      .then(data => {
        setCountryData(data)
      })
      .catch(error => console.error(error))
    },[])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='play' element={<PlayGame countryData={countryData} />} />
          <Route path='game-over' element={<GameOver />} />
          <Route path='profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}