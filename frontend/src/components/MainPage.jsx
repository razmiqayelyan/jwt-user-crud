import { Box } from '@mui/material'
import React from 'react'
import UserSettings from './UserSettings'

const MainPage = () => {
  return (
    <>
    <Box sx={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        gap:5
    }}>

        <UserSettings/>
    
    </Box>
      
    </>
  )
}

export default MainPage
