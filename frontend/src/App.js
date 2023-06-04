import './App.css';
import { BrowserRouter, Router, Routes, Route} from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import RegisterPage from "./components/Pages/RegisterPage";
import LoginPage from "./components/Pages/LoginPage";
import UserProfilePage from "./components/Pages/UserProfilePage";



function App() {

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path='/profile/:handle' element={<UserProfilePage/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
  
}

export default App;
