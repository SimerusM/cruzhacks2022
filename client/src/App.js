import { Navbar, Welcome, Footer, Publish, Verify, Login, Homepage } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className="min-h-screen">
      
        <Navbar />
        <Router>
          <Routes>
            <Route path='/' exact element={<Homepage /> } />
            
            <Route path='/login' element={<Login/>} />
            
          </Routes>
        </Router>
      
      <Footer />
    </div>
  )
}

export default App