import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import { menuItems } from '@/common/constants/menu';

export default function PageHeader({ contents }: { contents: string }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbs = () => {
    const crumbs = [];
    // Always start with Hyper (or Home)
    crumbs.push({ text: 'Home', to: '/' });

    // Find current menu item
    for (const menu of menuItems) {
      if (menu.children) {
        for (const child of menu.children) {
          if (location.pathname.includes(child.to)) {
            crumbs.push({ text: menu.text, to: '#' }); // Parent menu
            crumbs.push({ text: child.text, to: child.to }); // Current page
            return crumbs;
          }
        }
      }
    }
    // Fallback if not found in menu (e.g. dashboard)
    if (pathnames.length === 0) {
      // Home
    } else {
      // Try to match manually or just show current page title
      crumbs.push({ text: contents, to: location.pathname });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
      }}
    >
      <Typography
        variant='h6'
        fontWeight='bold'
        sx={{ color: 'var(--title-color)' }}
      >
        {contents}
      </Typography>
      <Breadcrumbs aria-label='breadcrumb' sx={{ fontSize: '0.875rem' }}>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography key={crumb.text} color='text.primary'>
              {crumb.text}
            </Typography>
          ) : (
            <MuiLink
              component={Link}
              to={crumb.to}
              underline='hover'
              color='inherit'
              key={crumb.text}
            >
              {crumb.text}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
