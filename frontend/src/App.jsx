import './App.css'
import Home from './pages/Home'
import Workout from './components/Workout'
import Diet from './pages/Diet'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/workout" element={<Workout />} />
      <Route path="/diet" element={<Diet />} />
    </Routes>
  )
}

export default App