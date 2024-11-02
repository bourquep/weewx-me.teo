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
- Customizable dashboard content and layout
- Multi-language support

## Installation

### Prerequisites

You will need a working WeeWX installation. So far, this skin has only been tested with WeeWX 5.1.0.

### Standard Installation

1. Run the following command on your WeeWX server:

```bash
weectl extension install https://github.com/bourquep/weewx-me.teo/releases/latest/download/weewx-me.teo.zip
```

2. Restart WeeWX:

```bash
sudo systemctl restart weewx
```

_The command required to restart WeeWX may vary depending on your WeeWX installation. Please refer to the
[WeeWX documentation](https://weewx.com/docs/5.1/usersguide/running/#running-as-a-daemon) for more information._

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
liking. The most likely customization you'll want to make is to edit the `observations_current` variable to list which
observations you want on your Me.teo dashboard and in what order.

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

## Developer's Guide

This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, install the dependencies:

```bash
npm install --force
```

_The skin uses NextJS v15, which has a peer dependency on React v19 RC, which makes many packages fail to install
because of peer dependency mismatch. Right now, `npm install --force` must be used to work around this, but hopefully
React v19 will be out of RC soon and that workaround won't be needed anymore._

Then, run the development server:

```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Data Flow

- The skin uses a hybrid approach combining static generation and client-side updates
- The NextJS app is pre-compiled and served as a static site
- Weather data is generated by the WeeWX report engine in the `data/*.json` files
- These JSON files are fetched by the client-side app, reloaded automatically every minute
- When running the development server, the skin will use sample data from the `public/sample_data` directory.

### Architecture Diagram

```mermaid
architecture-beta
  group users(cloud)[Users]
  group skin(cloud)[weewx-me.teo]
  group weewx(cloud)[WeeWX]

  service nextjs(server)[NextJS app] in skin
  service sample(disk)[Sample JSON data] in skin
  service json(disk)[JSON data files] in weewx
  service html(disk)[HTML files] in weewx
  service cheetah(server)[Cheetah templates] in weewx

  service visitor(internet)[External visitor] in users
  service developer(internet)[Developer] in users

  visitor:R -- L:html
  html:R -- L:json

  developer:R -- L:nextjs
  nextjs:R -- L:sample

  nextjs:B --> T:html
  cheetah:T --> B:json
```

### Adding New Languages

1. [Fork](https://github.com/bourquep/weewx-me.teo/fork) this repository
2. Create a new code translation file in `messages/xx.json`
3. Copy the template from `en.json`
4. Translate all strings
5. Create a new skin translation file in `weewx/skins/me.teo/lang/xx.json`
6. Copy the template from `en.json`
7. Translate all strings
8. Add the language code to:
   - the `build-locale` language matrix in `.github/workflows/ci.yml`
   - the `CopyGenerator.copy_once` list in `weewx/skins/me.teo/skin.conf`
9. Add the language to the list of supported languages in `README.md`
10. Submit a pull request and be a hero!

### NextJS

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions
are welcome!

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
