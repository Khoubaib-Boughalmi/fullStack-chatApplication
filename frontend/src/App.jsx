import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { Blog } from './components/Blog';
import { Posts } from './components/Posts';
import { Post } from './components/Post';
import { PostsLists } from './components/PostsLists';
import { NotFound } from './components/NotFound';
import { NavBar } from './components/NavBar';


function App() {

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element= { <Home /> } />
        <Route path='/blog' element= { <Blog /> } />
        <Route path='/posts' element= { <Posts /> }>
          <Route index element={<PostsLists />}/>
          <Route path='/posts/:slug' element= { <Post /> } />
        </Route>
        <Route path='*' element= { <NotFound /> } />
      </Routes>
    </Router>
  )
}

export default App
