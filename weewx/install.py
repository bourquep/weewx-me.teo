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
        super(MeteoInstaller, self).__init__(
            version=VERSION,
            name=NAME,
            description=DESCRIPTION,
            author=AUTHOR,
            author_email=AUTHOR_EMAIL,
            config=config_dict,
            files=[
              ('skins/me.teo', ['skins/me.teo/skin.conf']),
              ('skins/me.teo/data', ['skins/me.teo/data/*']),
              ('skins/me.teo/html', ['skins/me.teo/html/*'])
            ]
        )

config_string = """
[StdReport]
    [[Me.teo]]
        skin = me.teo
        enable = true
"""
config_dict = configobj.ConfigObj(StringIO(config_string))
