import { Box } from "@mui/material"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { authState } from "../features/auth/authSlice"
import MainPage from "./MainPage"
import Sidebar from "./Sidebar"


const Profile = () => {
  const {user} = useSelector(authState)
  const navigate = useNavigate()
  useEffect(() => {
    if(!user){
      navigate("/login")
    }
  }, [user, navigate])
 
  return (<>
    <Box sx={{
      width:"100vw",
      height:"100vh",
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-evenly"
    }}>

      <Box position='static' sx={{
      width:"20%",
      height:"100%",
      display:{xs:"none", sm:"flex"}
    }}><Sidebar/></Box>
      
      <Box  position='static' sx={{
        minWidth:"80%",
      }}><MainPage/></Box>
       
    </Box>
  </>
  )
}

export default Profile
