import { Box, Button, IconButton, Input, InputAdornment, LinearProgress, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { authState, login, reset } from "../features/auth/authSlice"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {


  const [showPass, setShowPass] = useState(false)


  const [formData, setFormData] = useState({
    username:"",
    password:"",
  })
  const {user, isLoading, isError, isSuccess, message} = useSelector(authState)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(login(formData))
}

  const onChange = (e) => {
    setFormData((state) => ({
      ...state, 
      [e.target.name]:e.target.value
    }))
  }

  useEffect(() => {

    if(isLoading){
      <LinearProgress/>
    }

    if(isError){
      if(message === "Request failed with status code 403") toast.error("Uncorrect Data")
      else{toast.error(message)}
      setFormData({
        username:"",
        password:"",
      })
    }
    if(isSuccess || user){
      navigate('/')
    }
    dispatch(reset())

  }, [user, isLoading, isError, isSuccess, message, dispatch, navigate])

  return (
    <Box sx={{
      display:"flex",
      alignItems:"center",
      justifyContent:"center"
    }}>
      
      <Box sx={{
        marginTop:5,
        width:{xs:"90vw", sm:"70vw"},
        maxWidth:{xs:"90vw", sm:"70vw", md:"60vw"}
      }}>
        <Typography sx={{textAlign:"center", fontFamily:"Lucida Console, Courier New, monospace", fontSize:28, color:"gray"}}>Login</Typography>
        <form onSubmit={onSubmit}>
        <Box sx={{
          display:"flex",
          flexDirection:"column",
          gap:6,
          marginTop:3
        }}>
        <Input onChange={onChange} required name='username' type="text" value={formData.username} focused='true' placeholder="Username" />
        <Input type={showPass ? 'text' : 'password'} value={formData.password} required name='password' onChange={onChange}  placeholder="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass(!showPass)}>
                  {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
          />
        <Button variant="contained" type="submit">Login</Button>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default Login
