import './App.css'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'
import Home from './pages/Home'
import Workout from './components/Workout'
import Diet from './pages/Diet'
import LeaderBoard from './pages/Leaderboard'
const SWIPE_PAGES = ['/', '/leaderboard']

function AppWrapper() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentIndex = SWIPE_PAGES.indexOf(location.pathname)

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex !== -1 && currentIndex < SWIPE_PAGES.length - 1)
        navigate(SWIPE_PAGES[currentIndex + 1])
    },
    onSwipedRight: () => {
      if (currentIndex > 0)
        navigate(SWIPE_PAGES[currentIndex - 1])
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
  })

  return (
    <div {...handlers} style={{ minHeight: '100svh' }}>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/workout"     element={<Workout />} />
        <Route path="/diet"        element={<Diet />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </div>
  )
}

function App() {
  return <AppWrapper />
}

export default App