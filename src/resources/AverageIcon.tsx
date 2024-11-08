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

import { SvgIcon, SvgIconProps } from '@mui/material';

function AverageIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g id="average_24px" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" fillOpacity="0.87">
        <path
          d="M12.4140625,12.6289062 L15.2265625,8 L17.7578125,8 L13.609375,14.2695312 L17.8867188,20.6796875 L15.3789062,20.6796875 L12.4492188,15.9335938 L9.51953125,20.6796875 L7,20.6796875 L11.2773438,14.2695312 L7.12890625,8 L9.63671875,8 L12.4140625,12.6289062 Z M8,4 L17,4 L17,6 L8,6 Z"
          fill="#5F6368"
          fillRule="nonzero"
        />
      </g>
    </SvgIcon>
  );
}

export default AverageIcon as typeof SvgIcon;
