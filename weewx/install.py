# Installer for the Me.teo WeeWX skin
# Pascal Bourque, 2024

import configobj
from setup import ExtensionInstaller
from io import StringIO
import os

VERSION      = "0.1.0"
NAME         = 'Me.teo'
DESCRIPTION  = 'A delightful skin for WeeWX.'
AUTHOR       = "Pascal Bourque"
AUTHOR_EMAIL = "pascal@cosmos.moi"

def loader():
    return MeteoInstaller()

class MeteoInstaller(ExtensionInstaller):
    def __init__(self):
        # Determine the directory where this installer lives
        this_dir = os.path.abspath(os.path.dirname(__file__))
        skin_dir = os.path.join(this_dir, 'skins/me.teo')

        # Find all the files in the skin directory
        file_list = []
        for dirpath, _, filenames in os.walk(skin_dir):
            for f in filenames:
                rel_path = os.path.relpath(dirpath, this_dir)
                file_list.append((rel_path, [os.path.join(dirpath, f)]))

        super(MeteoInstaller, self).__init__(
            version=VERSION,
            name=NAME,
            description=DESCRIPTION,
            author=AUTHOR,
            author_email=AUTHOR_EMAIL,
            config=config_dict,
            files=file_list
        )

config_string = """
[StdReport]
    [[Me.teo]]
        skin = me.teo
        enable = true
"""
config_dict = configobj.ConfigObj(StringIO(config_string))
