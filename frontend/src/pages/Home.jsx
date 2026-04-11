import DailyProgress from "../components/DailyProgress"
import "./Home.css"

function Home() {
    return (
        <div className="home">
            <div className="home-header">
                <span className="home-title">Maalam  Fitness Challenge 💪</span>
                <button className="bell-btn" onClick={() => alert('No notifications yet')}>
                    🔔
                </button>
            </div>
            <DailyProgress />
        </div>
    )
}

export default Home