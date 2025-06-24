import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import PeopleIcon from '@mui/icons-material/People';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: '사용자관리', path: '/user-management/users', icon: <PeopleIcon /> },
  { text: '장비관리', path: '/', icon: <ComputerIcon /> },
  {
    text: '공지사항',
    path: '/',
    icon: <AnnouncementIcon />,
  },
];

export default function Sidebar() {
  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1e1e2f',
          color: '#fff',
        },
      }}
    >
      <Toolbar>
        <Typography variant='h6' noWrap component='div' sx={{ color: '#fff' }}>
          Admin Menu
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              sx={{ '&:hover': { backgroundColor: '#33334d' }, color: '#fff' }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
