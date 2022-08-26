import { Button, IconButton, Input, InputAdornment, LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify'
import { useEffect, useState } from "react";
import { authState, register, reset } from "../features/auth/authSlice.js";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [showPass, setShowPass] = useState(false)
  const [showConfPass, setShowConfPass] = useState(false)

  const [formData, setFormData] = useState({
    username:"",
    email:"",
    password:"",
    confirmPass:"",
    full_name:"",
    phone:""
  })
  const { password, confirmPass} = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, isLoading, isError, isSuccess, message} = useSelector(authState)

  const onSubmit = (e) => {
    e.preventDefault()
    if(password !== confirmPass){
      toast.error("Passwords do not match")
    }else{
      dispatch(register(formData))
    }
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
      toast.error(message)
    }
    if(isSuccess || user){
      navigate('/')
    }
    dispatch(reset())

  }, [user, isLoading, isError, isSuccess, message, navigate, dispatch])

  const confPassFunc = () => {
    if (confirmPass && confirmPass !== password){

    return (<Input error type={showConfPass ? 'text' : 'password'} value={formData.confirmPass} required name='confirmPass' onChange={onChange}  placeholder="Confirm Password"
    endAdornment={
      <InputAdornment position="end">
        <IconButton onClick={() => setShowConfPass(!showConfPass)}>
          {showConfPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    }
  />)}
  else{
   return <Input  type={showConfPass ? 'text' : 'password'} value={formData.confirmPass} required name='confirmPass' onChange={onChange}  placeholder="Confirm Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfPass(!showConfPass)}>
                  {showConfPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
          />
  }
  }
  
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
        <Typography sx={{textAlign:"center", fontFamily:"Lucida Console, Courier New, monospace", fontSize:28, color:"gray"}}>Registration</Typography>
        <form onSubmit={onSubmit}>
        <Box sx={{
          display:"flex",
          flexDirection:"column",
          gap:3,
          marginTop:3
        }}>
        <Input onChange={onChange} required name='username' type="text" value={formData.username} focused='true' placeholder="Username" />
        <Input onChange={onChange} required name='email' type="email" value={formData.email}  placeholder="Email" />
        <Input onChange={onChange}  name='full_name' type="text" value={formData.full_name}  placeholder="Full Name" />
        <Input onChange={onChange}  name='phone' type="text" value={formData.phone}  placeholder="Phone Number" />

        <Input type={showPass ? 'text' : 'password'} value={formData.password} required name='password' onChange={onChange}  placeholder="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass(!showPass)}>
                  {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
          />
            {confPassFunc()}
        <Button  variant="contained" type="submit">Register</Button>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default Register
