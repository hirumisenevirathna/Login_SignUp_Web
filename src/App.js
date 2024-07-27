import { Routes, Route } from 'react-router-dom'
import './App.css';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  const isUsersSignIn = !!localStorage.getItem('token')

  return (
    <div className="App">
      <Navbar/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          {isUsersSignIn &&  <Route path='/account' element={<Account/>}/>}
      </Routes>
    </div>
  );
}

export default App;
