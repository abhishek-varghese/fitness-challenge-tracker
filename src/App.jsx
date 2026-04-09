import ActivityCard from './components/ActivityCard'
import './App.css'
import Home from './pages/Home'
import { Routes, Route} from 'react-router-dom'
function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/workout" element={<Workout />} /> */}
    </Routes>
  )
}


export default App
