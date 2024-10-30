'use client';

import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { useFormatter } from 'next-intl';

interface PageHeaderProps {
  stationLocationName: string;
  stationCoordinates: string;
  observationDate: Date;
  pageTitle: string;
}

export default function PageHeader(props: PageHeaderProps) {
  const format = useFormatter();

  return (
    <AppBar>
      <Toolbar>
        <Stack>
          <Typography variant="h6" component="div">
            {props.stationLocationName}
          </Typography>
          <Typography variant="caption">{props.stationCoordinates}</Typography>
        </Stack>

        <Box flexGrow={1} />

        <Stack textAlign="end">
          <Typography variant="h6">{props.pageTitle}</Typography>
          <Typography variant="caption">
            {format.dateTime(props.observationDate, { dateStyle: 'medium', timeStyle: 'medium' })}
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
