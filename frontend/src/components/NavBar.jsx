import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material"
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';
import { authState, logout, reset } from "../features/auth/authSlice.js";


const NavBar = () => {
    const dispatch = useDispatch()
    const {data, isLoading} = useSelector(authState)
    const logOut = () => {
        dispatch(logout())
        dispatch(reset())
        return
    }
    if(isLoading) return <LinearProgress/>
  return (
    <AppBar position="sticky">
        <Toolbar sx={{
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between"
        }}>

            <Link  style={{ textDecoration: 'none' }} to='/'>
                <IconButton >
                    <FingerprintIcon sx={{color:"background.default"}}/>
                </IconButton>
                
            </Link>
            {data?.user? <Typography> Welcome {data.user.full_name? data.user.full_name : data.user.username}</Typography>: ""}
            <Box sx={{
                display:"flex",
                alignItems:"center",
                gap:1,
                color:"white",
            }}>
                {data?.user?
                <>
                <Button onClick={logOut} variant="outlined" sx={{ color:"white"}} startIcon={<LogoutIcon/>}>Logout</Button>
                </>
                 :
                 <>
               <Link  style={{ textDecoration: 'none' }} to={'/login'}><Button variant="outlined" sx={{ color:"white"}} startIcon={<LoginIcon/>}>Login</Button></Link>
               <Link  style={{ textDecoration: 'none' }} to={'/register'}><Button variant="outlined" sx={{ color:"white"}} startIcon={<HowToRegIcon/>}>Register</Button></Link></>
                }
            </Box>


        </Toolbar>
    </AppBar>
  )
}

export default NavBar
