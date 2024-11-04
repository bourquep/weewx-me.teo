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
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PageHeaderProps {}

interface LoadedPageHeaderProps extends PageHeaderProps {
  data: GlobalData;
  title: string;
  subtitle: string;
  openMenu: (event: React.MouseEvent<HTMLElement>) => void;
  onCloseMenu: () => void;
}

export default function PageHeader(props: PageHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data, isLoading, error } = useGlobalData();
  const { title, subtitle } = useNavigation();
  const router = useRouter();
  const t = useTranslations();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchor);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const onCloseMenu = () => {
    setMenuAnchor(null);
  };
  const navigate = (route: string) => {
    onCloseMenu();
    router.push(route);
  };

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
            <CompactPageHeader
              {...props}
              data={data}
              title={title}
              subtitle={subtitle}
              openMenu={openMenu}
              onCloseMenu={onCloseMenu}
            />
          ) : (
            <RegularPageHeader
              {...props}
              data={data}
              title={title}
              subtitle={subtitle}
              openMenu={openMenu}
              onCloseMenu={onCloseMenu}
            />
          )}
        </Toolbar>
      </AppBar>

      <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={onCloseMenu}>
        <MenuItem onClick={() => navigate('/')}>{t('Current.PageTitle')}</MenuItem>
        <MenuItem onClick={() => navigate('/week-to-date')}>{t('WeekToDate.PageTitle')}</MenuItem>
        <MenuItem onClick={() => navigate('/month-to-date')}>{t('MonthToDate.PageTitle')}</MenuItem>
        <MenuItem onClick={() => navigate('/day')}>{t('Day.PageTitle')}</MenuItem>
        <MenuItem onClick={() => navigate('/month')}>{t('Month.PageTitle')}</MenuItem>
        <MenuItem onClick={() => navigate('/year')}>{t('Year.PageTitle')}</MenuItem>
      </Menu>

      <Offset />
    </Stack>
  );
}

function CompactPageHeader(props: LoadedPageHeaderProps) {
  return (
    <>
      <Stack sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row">
          <Typography variant="h6" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {props.data.station.location}
          </Typography>

          <Box flexGrow={1} />

          <IconButton size="small" onClick={props.openMenu}>
            <ExpandCircleDownOutlinedIcon fontSize="inherit" />
          </IconButton>
        </Stack>

        <Stack direction="row">
          <Typography variant="caption" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {props.subtitle}
          </Typography>

          <Box flexGrow={1} />

          <Typography variant="caption" component="div" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {props.title}
          </Typography>
        </Stack>
      </Stack>
    </>
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

      <IconButton size="large" onClick={props.openMenu}>
        <ExpandCircleDownOutlinedIcon fontSize="inherit" />
      </IconButton>
    </>
  );
}
