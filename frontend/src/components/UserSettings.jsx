import { IconButton, Input, InputAdornment, LinearProgress } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { authState } from '../features/auth/authSlice'
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
const UserSettings = () => {
    const {data} = useSelector(authState)
    const [show, setShow] = useState({
        username:true,
        email:true,
        full_name:true,
        phone:true
    })
    const [formData, setFormData] = useState({
        username:"",
        email:"",
        password:"",
        confirmPass:"",
        full_name:"",
        phone:""
      })
    if(!data?.user) return <LinearProgress/>
    const {username, email, full_name, phone} = data?.user
    const onChange = (e) => {
        setFormData((state) => ({
          ...state, 
          [e.target.name]:e.target.value
        }))
      }

  return (
    <Box sx={{
        marginTop:5
    }}>
         <Input type='text' readOnly={show.username} defaultValue={username} required name='username' onChange={onChange}  placeholder="Username"
            endAdornment={
              <InputAdornment position="end">
                <IconButton name='username' onClick={(e) => setShow((state) => ({
                ...state, 
                username:!state.username
                }))}>
                  {show.username ?  <EditIcon/> : <DoneIcon />  }
                </IconButton>
              </InputAdornment>
            }
          />
        {/* <p>{username}</p>
        <p>{email}</p> 
        <p>{full_name}</p>
        <p>{phone}</p> */}
    </Box>
  )
}

export default UserSettings
