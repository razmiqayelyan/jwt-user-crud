import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Profile from './components/Profile';
import Login from './components/Login'
import NavBar from './components/NavBar';
import Register from './components/Register';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { authState, userInfo } from "./features/auth/authSlice"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";





function App() {
  const {user, isError} = useSelector((state) => authState(state))
  const dispatch = useDispatch()
  useEffect(() => {
    if(isError || user === null) localStorage.removeItem("user")
    if(user) dispatch(userInfo())
  }, [user, dispatch, isError])
  return (
    <>
      <Router>
        <NavBar/>
        <Routes>
        <Route path='/' element={<Profile/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
        </Routes>
      </Router>
      <ToastContainer/>
    </>

  );
}

export default App;
