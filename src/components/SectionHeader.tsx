'use client';

import { Stack, Typography } from '@mui/material';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader(props: SectionHeaderProps) {
  return (
    <Stack>
      <Typography variant="h4">{props.title}</Typography>
      {props.subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          {props.subtitle}
        </Typography>
      )}
    </Stack>
  );
}
