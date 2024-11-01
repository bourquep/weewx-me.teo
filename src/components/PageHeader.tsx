/*
weewx-me.teo
Copyright (C) 2024 Pascal Bourque

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use client';

import { AppBar, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useFormatter } from 'next-intl';

interface PageHeaderProps {
  stationLocationName: string;
  stationCoordinates: string;
  observationDate: Date;
  pageTitle: string;
}

export default function PageHeader(props: PageHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar>
      <Toolbar>{isMobile ? <CompactPageHeader {...props} /> : <RegularPageHeader {...props} />}</Toolbar>
    </AppBar>
  );
}

function CompactPageHeader(props: PageHeaderProps) {
  const format = useFormatter();

  return (
    <Stack textAlign="center" sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant="h6" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {props.stationLocationName}
      </Typography>
      <Typography variant="caption" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {format.dateTime(props.observationDate, { dateStyle: 'medium', timeStyle: 'medium' })}
      </Typography>
    </Stack>
  );
}

function RegularPageHeader(props: PageHeaderProps) {
  const format = useFormatter();

  return (
    <>
      <Stack sx={{ minWidth: 0, flex: 1.25 }}>
        <Typography variant="h6" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {props.stationLocationName}
        </Typography>
        <Typography variant="caption" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {props.stationCoordinates}
        </Typography>
      </Stack>

      <Stack textAlign="end" sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h6" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {props.pageTitle}
        </Typography>
        <Typography variant="caption" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {format.dateTime(props.observationDate, { dateStyle: 'medium', timeStyle: 'medium' })}
        </Typography>
      </Stack>
    </>
  );
}
