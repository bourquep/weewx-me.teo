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
