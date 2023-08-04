import { BrowserRouter as Router, Route, Routes, } from "react-router-dom"
import Home from './components/pages/Home'
import Company from './components/pages/Company'
import Contact from './components/pages/Contact'
import NewProject from "./components/pages/NewProject"


import Container from "./components/Layout/Container"
import Navbar from "./components/Layout/Navbar"
import Footer from "./components/Layout/Footer"
import Projects from "./components/pages/Projects"
import Project from "./components/pages/Project"


function App() {
  return (
    <Router>
      <Navbar/>  
      <Container customClass='min-height'>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path='/NewProject' element={<NewProject/>}/>
          <Route path='/Projects' element={<Projects/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/company' element={<Company/>}/>
          <Route path='/project/:id' element={<Project/>}/>
        </Routes>
      </Container>
      <Footer/> 
    </Router>
  );
}

export default App;
