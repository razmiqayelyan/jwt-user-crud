import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import GroupIcon from '@mui/icons-material/Group';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from "@mui/system";


const Sidebar = () => {
  return (
    <>
    <Box position='fixed' sx={{display:{xs:"none", sm:"flex"}}}>

      <List sx={{ minWidth: '20vw', minHeight:"90vh", maxWidth: 360, bgcolor: 'background.paper', borderRight: "2px solid lightgray" }}>
    <Box>
      <ListItemButton>
        <ListItemIcon>
          <AccountBoxIcon/>
          </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <GroupIcon/>
          </ListItemIcon>
        <ListItemText primary="Friends" />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <ChatIcon/>
          </ListItemIcon>
        <ListItemText primary="Messages" />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <SettingsIcon/>
          </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </Box>

      </List>
    </Box>
    </>
  )
}

export default Sidebar
