# weewx-me.teo
# Copyright (C) 2024 Pascal Bourque
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import configobj
from weecfg.extension import ExtensionInstaller
from io import StringIO
import os

VERSION      = "##SKIN_VERSION##"
NAME         = 'Me.teo'
DESCRIPTION  = 'A modern, responsive web interface skin for WeeWX.'
AUTHOR       = "Pascal Bourque"
AUTHOR_EMAIL = "pascal@cosmos.moi"

def loader():
    return MeteoInstaller()

def get_files():
    skin_files = {}
    this_dir = os.path.dirname(os.path.abspath(__file__))
    skin_path = os.path.join(this_dir, 'skins/me.teo')
    for root, dirs, files in os.walk(skin_path):
        relative_path = root[len(this_dir)+1:]
        skin_files[relative_path] = []
        for file in files:
            skin_files[relative_path].append(os.path.join(relative_path, file))
    return [(k,v) for k,v in skin_files.items()]

class MeteoInstaller(ExtensionInstaller):
    def __init__(self):
        files = get_files()
        files.append(('bin/user', ['bin/user/meteo.py']))

        super(MeteoInstaller, self).__init__(
            version=VERSION,
            name=NAME,
            description=DESCRIPTION,
            author=AUTHOR,
            author_email=AUTHOR_EMAIL,
            config=config_dict,
            files=files
        )

config_string = """
[StdReport]
    [[Me.teo]]
        skin = me.teo
        enable = true

        # If you are installing this skin in a subdirectory of your web server, you need to set HTML_SUBDIR to the name of the subdirectory.
        # For example, if your web server is serving files from "/var/www/html", and you have set HTML_ROOT for this skin to "/var/www/html/meteo",
        # set HTML_SUBDIR to "meteo".
        # HTML_SUBDIR = meteo
"""
config_dict = configobj.ConfigObj(StringIO(config_string))
