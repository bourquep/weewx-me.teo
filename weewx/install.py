"""
Installation script for the Me.teo WeeWX skin.
"""
import os.path
import configobj

import weewx.extension
from setup import ExtensionInstaller

VERSION = "0.1.0"

# Find all files in directory recursively
def find_files(directory):
    matches = []
    for root, dirnames, filenames in os.walk(directory):
        for filename in filenames:
            # Get the relative path from the skin directory
            relative_path = os.path.relpath(os.path.join(root, filename), directory)
            matches.append(os.path.join(root, filename))
    return matches

def loader():
    return MeteoSkinInstaller()

class MeteoSkinInstaller(ExtensionInstaller):
    def __init__(self):
        skin_files = find_files('skins/me.teo')

        super(MeteoSkinInstaller, self).__init__(
            version=VERSION,
            name='Me.teo',
            description='A delightful skin for WeeWX.',
            author="Pascal Bourque",
            author_email="pascal@cosmos.moi",
            config={
                'StdReport': {
                    'Me.teo': {
                        'skin': 'me.teo',
                        'enable': True,
                    }
                }
            },
            files=[
                ('skins/me.teo', skin_files),
            ]
        )

if __name__ == '__main__':
    installer = MeteoSkinInstaller()
