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

import { useNavigation } from '@/contexts/NavigationContext';
import { useGlobalData } from '@/libs/DataSource';
import {
  AppBar,
  Box,
  CircularProgress,
  Stack,
  styled,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

interface PageHeaderProps {}

interface LoadedPageHeaderProps extends PageHeaderProps {
  data: GlobalData;
  title: string;
  subtitle: string;
}

export default function PageHeader(props: PageHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data, isLoading, error } = useGlobalData();
  const { title, subtitle } = useNavigation();

  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  return (
    <Stack>
      <AppBar>
        <Toolbar>
          {isLoading || error || !data ? (
            <>
              <Box flexGrow={1} />
              <Typography variant="caption" color="error">
                {isLoading && <CircularProgress />}
                {error && 'Error loading data'}
                {!isLoading && !error && !data && 'No data available'}
              </Typography>
              <Box flexGrow={1} />
            </>
          ) : isMobile ? (
            <CompactPageHeader {...props} data={data} title={title} subtitle={subtitle} />
          ) : (
            <RegularPageHeader {...props} data={data} title={title} subtitle={subtitle} />
          )}
        </Toolbar>
      </AppBar>

      <Offset />

      <Tabs
        value={0}
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 2, flex: 1 }}
      >
        <Tab label="Current" />
        <Tab label="Week-to-date" />
        <Tab label="Month-to-date" />
        <Tab label="Day" />
        <Tab label="Month" />
        <Tab label="year" />
      </Tabs>
    </Stack>
  );
}

function CompactPageHeader(props: LoadedPageHeaderProps) {
  return (
    <Stack textAlign="center" sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant="h6" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {props.data.station.location}
      </Typography>
      <Typography variant="caption" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {props.subtitle}
      </Typography>
    </Stack>
  );
}

function RegularPageHeader(props: LoadedPageHeaderProps) {
  return (
    <>
      <Stack sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h6" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {props.data.station.location}
        </Typography>
        <Typography variant="caption" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {`${props.data.station.latitude}, ${props.data.station.longitude}, ${props.data.station.altitude}`}
        </Typography>
      </Stack>

      <Stack textAlign="end" sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h6" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {props.title}
        </Typography>
        <Typography variant="caption" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {props.subtitle}
        </Typography>
      </Stack>
    </>
  );
}
