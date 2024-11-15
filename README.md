# WeeWX-Me.teo

A modern, responsive web interface skin for the [WeeWX weather station software](https://github.com/weewx/weewx).
WeeWX-Me.teo provides a clean, mobile-friendly dashboard focused on presenting current weather data in an intuitive and
visually appealing way.

| Light                                                                                            | Dark                                                                                            |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| ![iPad-light](https://github.com/user-attachments/assets/8936393b-4d76-40f0-8504-84e0cc68c3ac)   | ![iPad-dark](https://github.com/user-attachments/assets/4129fbe1-f956-444c-832c-3c300ee84538)   |
| ![iPhone-light](https://github.com/user-attachments/assets/27314538-da96-467a-b9bd-cc1868c6d88c) | ![iPhone-dark](https://github.com/user-attachments/assets/89f13407-70b5-4219-a107-cdf4f4bc259c) |

## Description

WeeWX-Me.teo is a custom skin for WeeWX that offers:

- Responsive design that works on desktop and mobile devices
- Support for light and dark modes
- Modern, clean user interface built with [MUI](https://mui.com) and [Next.js](https://nextjs.org)
- A focus on current weather conditions with trends from the past 24 hours
- Historical data visualizations for:
  - Week to date
  - Month to date
  - Daily summary
  - Monthly summary
  - Yearly summary
- Customizable dashboard content and layout
- Multi-language support

## Installation

### Prerequisites

You will need a working WeeWX installation. So far, this skin has only been tested with WeeWX 5.1.0.

### Standard Installation

> [!IMPORTANT]
> You **do not** need to clone this repository to install the skin. The following instructions will guide
> you through the simple installation process.

1. Run the following command on your WeeWX server:

```bash
weectl extension install https://github.com/bourquep/weewx-me.teo/releases/latest/download/weewx-me.teo.zip
```

2. Restart WeeWX:

```bash
sudo systemctl restart weewx
```

> [!NOTE]
> The command required to restart WeeWX may vary depending on your WeeWX installation. Please refer to the
> [WeeWX documentation](https://weewx.com/docs/5.1/usersguide/running/#running-as-a-daemon) for more information.

## Configuration

### Basic Configuration

The WeeWX extension installer adds the following to your `weewx.conf`:

```ini
[StdReport]
    [[Me.teo]]
        skin = me.teo
        enable = true
```

There's not much else needed to get started. You can have a look at the `skin.conf` file to customize the skin to your
liking. The most likely customization you'll want to make is to edit the `observations_current` and `observations_summary`
variables to list which observations you want on your Me.teo dashboard and in what order.

### Configuring `HTML_ROOT` and `HTML_SUBDIR`

If you are installing this skin in a subdirectory of your web server, you need to set `HTML_SUBDIR` to the name of the subdirectory.
For example, if your web server is serving files from `/var/www/html`, and you have set `HTML_ROOT` for this skin to `/var/www/html/meteo`,
you must set `HTML_SUBDIR` to `meteo`.

```ini
[StdReport]
    [[Me.teo]]
        skin = me.teo
        enable = true

        HTML_ROOT = public_html/foo/bar

        # If web server is configured to serve files from public_html:
        HTML_SUBDIR = foo/bar
```

### Google Analytics

If you have a Google Analytics account and want to track visits to your site, you can add your tracking ID to the skin
configuration in `weewx.conf`:

```ini
[StdReport]
    [[Me.teo]]
        skin = me.teo
        enable = true

        [[[Extras]]]
            googleAnalyticsId = "G-XXXXXXXXXX"
```

## Localization

### Supported Languages

- English (default)
- French

### Language Selection

The skin respects the settings in `weewx.conf` for:

- Observation labels (e.g. _Outside Temperature_)
- Unit labels (e.g. _°C_)
- Unit selection (e.g. _metric_ or _us_)

Regardless of which skin language is being served to the site visitor, the observation and unit labels will be displayed
using the settings in `weewx.conf`.

The HTML skin locale served to the site visitor will be dependant on which of the languages is served. The skin includes
statically-built HTML files for each supported language in a subdirectory named after the language code, e.g. `en` or
`fr`.

The served HTML skin locale affects the language of the user interface elements such as the navigation bar, as well as
date and number formatting.

When configuring your web server, you can either:

- Serve the language-specific subdirectory, which effectively means that your site will be accessible only in that
  specific language.
- Serve the root directory and have visitors navigate to `/en` or `/fr` to switch languages.

If the latter approach is used, please be aware that the observation and unit labels will still be displayed according
to the settings in `weewx.conf`.

## Contributing

If you want to contribute to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

WeeWX-Me.teo is licensed under the GNU Public License v3. This means you are free to use, modify and redistribute this
software, provided that any derivative works you create are also licensed under GPL v3 and make their source code
available. The GPL v3 ensures that this software and any modifications remain free and open source.

## Copyright

© 2024 Pascal Bourque

## Support

For bug reports and feature requests, please use the [GitHub Issues](https://github.com/bourquep/weewx-me.teo/issues)
page.

For general questions and discussions, join our
[Discussion Forum](https://github.com/bourquep/weewx-me.teo/discussions).
