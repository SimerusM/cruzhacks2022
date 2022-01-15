import { Navbar, Welcome, Footer, Publish, Verify } from './components';

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Publish />
      <Verify />
      <Footer />
    </div>
  )
}

export default App