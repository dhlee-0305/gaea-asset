import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import PeopleIcon from '@mui/icons-material/People';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { Link } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';

const menuItems = [
  {
    key: 'user-management',
    text: '사용자관리',
    path: '/user-management/users',
    icon: <PeopleIcon />,
    children: [
      { text: '부서관리', to: '/bo/user-management/departments' },
      { text: '사용자관리', to: '/bo/user-management/users' },
    ],
  },
  {
    key: 'device-management',
    text: '장비관리',
    path: '/',
    icon: <ComputerIcon />,
    children: [
      { text: '장비관리', to: '/bo/device-management/devices' },
      { text: '장비유형관리', to: '/bo/device-management/device-types' },
    ],
  },
  {
    key: 'notice',
    text: '공지사항',
    path: '/',
    icon: <AnnouncementIcon />,
    children: [{ text: '공지사항', to: '/bo/notice/notices' }],
  },
];

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleClick = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1e1e2f',
          color: '#fff',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Toolbar />
        <List>
          {menuItems.map((menu) => (
            <Box key={menu.key}>
              <ListItemButton
                sx={{
                  '&:hover': { backgroundColor: '#33334d' },
                  color: '#fff',
                }}
                onClick={() => handleClick(menu.key)}
              >
                <ListItemIcon sx={{ color: '#fff' }}>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.text} />
                {openMenu === menu.key ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMenu === menu.key} timeout='auto'>
                <List component='div' disablePadding>
                  {menu.children?.map((child) => (
                    <ListItemButton
                      key={child.to}
                      component={Link}
                      to={child.to}
                      sx={{
                        '&:hover': { backgroundColor: '#33334d' },
                        color: '#fff',
                        pl: 4,
                      }}
                    >
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
