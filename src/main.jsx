import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import Login from './pages/forms/Login';
import SignUp from './pages/forms/SignUp';
import AddArticle from './pages/forms/addArticle';
import AddArticletoCommunity from './pages/forms/addToCommunity';
import ProfilePage from './pages/profiles/user'
import PageNotFound from './pages/PageNotFound';
import UserProfilePage from './pages/profiles/profile';
import ArticleView from './pages/view/ArticleView';
import Notifications from './pages/view/notifications';
import Home from './pages/view/HomePage'
import CommunityPage from './pages/view/Community';
import SessionManager from './components/SessionManager';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  {/* <SessionManager> */}
      <Routes>
        <Route path = '/SignUp' element={< SignUp/>} />
        <Route path = '/Login' element={< Login />} />
        <Route path = '/create' element={< AddArticle/>} />
        <Route path="/add-article/:communityId" element={<AddArticletoCommunity/>} />
        <Route path = '/profile' element={<ProfilePage/>} />
        <Route path = "/author/:slug" element={<UserProfilePage />} />
        <Route path="/articles/:slug" element={<ArticleView />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path = '/notifications' element={< Notifications/>} />
        <Route path = '/Home' element={< Home/>} />
        <Route path = '/' element={< Home/>} />
        <Route path = '*' element={<PageNotFound/>} />
      </Routes>
    {/* </SessionManager> */}
  </BrowserRouter>
)
