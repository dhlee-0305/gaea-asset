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
import { Link, useLocation } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    key: 'user-management',
    text: '사용자관리',
    icon: <PeopleIcon />,
    children: [
      { text: '부서관리', to: '/user-management/departments' },
      { text: '사용자관리', to: '/user-management/users' },
    ],
  },
  {
    key: 'device-management',
    text: '장비관리',
    icon: <ComputerIcon />,
    children: [
      { text: '장비관리', to: '/device-management/devices' },
      { text: '장비유형관리', to: '/device-management/device-types' },
    ],
  },
  {
    key: 'notice',
    text: '공지사항',
    icon: <AnnouncementIcon />,
    children: [{ text: '공지사항', to: '/notice/notices' }],
  },
];

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // 현재 경로에 해당하는 메뉴를 열기
    const currentMenu = menuItems.find(
      (menu) => location.pathname.indexOf(menu.key) > 0,
    );
    if (currentMenu) {
      setOpenMenu(currentMenu.key);
    }
  }, [location.pathname]);

  // 메뉴 클릭
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
                  {menu.children?.map((child) => {
                    const isSelected = location.pathname === child.to;
                    return (
                      <ListItemButton
                        key={child.to}
                        component={Link}
                        to={child.to}
                        sx={{
                          '&:hover': { backgroundColor: '#33334d' },
                          backgroundColor: isSelected ? '#2d2d4d' : 'inherit',
                          color: isSelected ? '#90caf9' : '#fff',
                          pl: 4,
                        }}
                      >
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
