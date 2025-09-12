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
import CampaignIcon from '@mui/icons-material/Campaign';
import Code from '@mui/icons-material/Code';
import { Link, useLocation } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { getToken, parseJwt } from '@/common/utils/auth';
import { USER_ROLE } from '@/common/constants';

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
    children: [{ text: '장비관리', to: '/device-management/devices' }],
  },
  {
    key: 'notice',
    text: '공지사항',
    icon: <CampaignIcon />,
    children: [{ text: '공지사항', to: '/notice/notices' }],
  },
  {
    key: 'code-management',
    text: '공통코드',
    icon: <Code />,
    children: [{ text: '공통코드', to: '/code-management/codes' }],
  },
];

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  // 사용자 정보 추출
  const token = getToken();
  const userInfo = token ? parseJwt(token) : null;

  // 메뉴 동적 구성
  type SidebarMenuItem = (typeof menuItems)[number];
  const dynamicMenuItems = menuItems.reduce<Array<SidebarMenuItem>>(
    (acc, menu) => {
      if (menu.key === 'user-management') {
        // 특정 권한에서만 사용자관리(및 하위 메뉴) 노출
        const allowed =
          !!userInfo &&
          (userInfo.roleCode === USER_ROLE.TEAM_MANAGER ||
            userInfo.roleCode === USER_ROLE.ASSET_MANAGER ||
            userInfo.roleCode === USER_ROLE.SYSTEM_MANAGER);
        if (!allowed) {
          return acc;
        }
      }

      if (menu.key === 'code-management') {
        // 시스템관리자만 공통코드 노출
        if (userInfo?.roleCode !== USER_ROLE.SYSTEM_MANAGER) {
          return acc;
        }
      }

      if (menu.key === 'device-management') {
        // 장비이력관리 메뉴는 권한 제한 없이 항상 노출
        const children = [...menu.children];
        if (!children.some((c) => c.text === '장비이력관리')) {
          children.push({
            text: '장비이력관리',
            to: '/device-management/device-history',
          });
        }
        acc.push({ ...menu, children });
        return acc;
      }

      acc.push(menu);
      return acc;
    },
    [],
  );

  useEffect(() => {
    // 현재 경로에 해당하는 메뉴를 열기
    const currentMenu = dynamicMenuItems.find(
      (menu) => location.pathname.indexOf(menu.key) > -1,
    );
    if (currentMenu) {
      setOpenMenu(currentMenu.key);
    }
  }, [location.pathname]);

  // 메뉴 클릭
  const handleClick = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  // 하위 메뉴 클릭 (특정 메뉴 초기화 목적)
  const handleChildClick = (e: React.MouseEvent, to: string) => {
    // 장비이력관리: 동일 페이지에서 클릭 시 전체 초기화(하드 리로드)
    if (
      to === '/device-management/device-history' &&
      location.pathname === to
    ) {
      e.preventDefault();
      window.location.href = to;
    }
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
          {dynamicMenuItems.map((menu) => (
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
                    const isSelected = location.pathname.indexOf(child.to) > -1;
                    return (
                      <ListItemButton
                        key={child.to}
                        component={Link}
                        to={child.to}
                        onClick={(e) => handleChildClick(e, child.to)}
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
