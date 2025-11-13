# brookjeynes.dev

Personal website built with Zine static site generator.

## Technologies

- **[Zine](https://zine-ssg.io/)** - Static site generator written in Zig
- **HTML/CSS** - Layout templates (`.shtml` files)
- **Multilingual support** - English (en-US) and Korean (ko-KR)

## Getting Started

### Prerequisites

#### Install Zine

Download from: https://github.com/kristoff-it/zine/releases

### Development

Start the development server with hot-reload:
```bash
zine serve
```

Visit `http://localhost:1990` in your browser.

### Build

Generate the static site for production:
```bash
zine release
```

Output will be in the `public/` directory.

## Project Structure

- `zine.ziggy` - Main configuration file
- `content/` - Markdown content (en-US, ko-KR)
- `layouts/` - HTML templates
- `assets/` - Static assets (fonts, PDFs, etc.)
- `i18n/` - Internationalization files
