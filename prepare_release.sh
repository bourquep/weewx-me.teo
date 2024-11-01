#! /bin/sh

cd package
sed "s/##SKIN_VERSION##/$1/" weewx-me.teo/install.py > weewx-me.teo/install.py.tmp
mv weewx-me.teo/install.py.tmp weewx-me.teo/install.py
zip -r weewx-me.teo.zip weewx-me.teo
