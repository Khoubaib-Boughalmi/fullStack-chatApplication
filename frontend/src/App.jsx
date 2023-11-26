import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import { ChatProvider }  from './context/chatProvider'
import Home  from "./pages/Home";
import Chats  from "./pages/Chats";

function App() {

  return (
    <ChakraProvider>
      <Router>
        <ChatProvider>
          <Routes>
            <Route path="/" element={ <Home/> }></Route>
            <Route path="/chat" element={ <Chats/> }></Route>
          </Routes>
        </ChatProvider>
      </Router>
    </ChakraProvider>
    )
  }
  
export default App

// <Router>
  //   <NavBar />
  //   <Routes>
  //     <Route path='/' element= { <Home /> } />
  //     <Route path='/blog' element= { <Blog /> } />
  //     <Route path='/posts' element= { <Posts /> }>
  //       <Route index element={<PostsLists />}/>
  //       <Route path='/posts/:slug' element= { <Post /> } />
  //     </Route>
  //     <Route path='*' element= { <NotFound /> } />
  //   </Routes>
  // </Router>
