import ComputerIcon from '@mui/icons-material/Computer';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import Code from '@mui/icons-material/Code';

export const menuItems = [
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
      { text: '장비이력관리', to: '/device-management/device-history' },
    ],
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
