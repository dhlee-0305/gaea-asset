import { TableCell, Typography } from '@mui/material';
import React from 'react';

export const LabelCell = ({ children }: { children: React.ReactNode }) => (
  <TableCell
    component='th'
    align='center'
    sx={{
      backgroundColor: '#f5f7fa',
      fontWeight: 'bold',
      width: '25%',
      border: '1px solid rgba(224, 224, 224, 1)',
    }}
  >
    {children}
  </TableCell>
);

export const ValueCell = ({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) => (
  <TableCell
    colSpan={colSpan}
    sx={{
      width: colSpan ? undefined : '25%',
      border: '1px solid rgba(224, 224, 224, 1)',
    }}
  >
    {children}
  </TableCell>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant='h6'
    sx={{
      mt: 3,
      mb: 1,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      '&::before': {
        content: '""',
        display: 'block',
        width: '4px',
        height: '18px',
        backgroundColor: '#3f51b5',
        marginRight: '8px',
      },
    }}
  >
    {children}
  </Typography>
);
