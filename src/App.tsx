import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

import Home from './components/Home';
import PlayGame from './components/PlayGame';
import StartGame from './components/StartGame';
import Stats from './components/Stats';
import Layout from './components/Layout';

import { countryData as cd } from './data/countryData';

import { Country } from './util/interfaces';

import '../main.css'
export default function App() {

  const [countryData, setCountryData] = React.useState<Country[]>([])
  React.useEffect(() => {
    setCountryData(cd)
  },[])

  // React.useEffect(() => {
  //     fetch('https://restcountries.com/v3.1/independent?status=true')
  //     .then(response => {
  //       console.log('API data retrieved...')
  //       if (!response.ok) {
  //         throw new Error("Could not fetch resource");
  //       }
  //       return response.json()
  //     })
  //     .then(data => {
  //       setCountryData(data)
  //     })
  //     .catch(error => console.error(error))
  //   },[])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='play' element={<PlayGame countryData={countryData} />} />
          <Route path='start' element={<StartGame />} />
          <Route path='stats' element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}