#! /bin/sh

cd package

sed "s/##SKIN_VERSION##/$1/" weewx-me.teo/install.py > weewx-me.teo/install.py.tmp
mv weewx-me.teo/install.py.tmp weewx-me.teo/install.py

sed "s/##SKIN_VERSION##/$1/" weewx-me.teo/skins/me.teo/skin.conf > weewx-me.teo/skins/me.teo/skin.conf.tmp
mv weewx-me.teo/skins/me.teo/skin.conf.tmp weewx-me.teo/skins/me.teo/skin.conf

zip -r weewx-me.teo.zip weewx-me.teo
