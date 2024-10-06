
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Apod from './Components/Apod';
import NasaMedia from './Components/NasaMedia';
import './App.css';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apod" element={<Apod />} />
                <Route path="/media" element={<NasaMedia />} />
            </Routes>
        </Router>
    );
}

export default App;
