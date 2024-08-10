import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './components/Landing'
import Shelf from './components/Shelf'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wall" element={<Shelf />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
