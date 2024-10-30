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
        super(MeteoInstaller, self).__init__(
            version=VERSION,
            name=NAME,
            description=DESCRIPTION,
            author=AUTHOR,
            author_email=AUTHOR_EMAIL,
            config=config_dict,
            files=get_files()
        )

config_string = """
[StdReport]
    [[Me.teo]]
        skin = me.teo
        enable = true
"""
config_dict = configobj.ConfigObj(StringIO(config_string))
