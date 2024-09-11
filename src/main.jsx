import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import Login from './pages/forms/Login';
import SignUp from './pages/forms/SignUp';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route path = '/SignUp' element={< SignUp/>} />
        <Route path='/Login' element={< Login />} />
      </Routes>
  </BrowserRouter>
)
