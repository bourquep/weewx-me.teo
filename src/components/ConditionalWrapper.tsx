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

interface ConditionalWrapperProps<T = {}> {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactElement<T>;
  children: React.ReactNode;
}

export default function ConditionalWrapper<T = {}>({ condition, wrapper, children }: ConditionalWrapperProps<T>) {
  return condition ? wrapper(children) : <>{children}</>;
}