# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo-based personal blog deployed to GitHub Pages at jithesh.org. The site uses the `hugo-blog-awesome` theme as a git submodule.

## Common Commands

```sh
# Local development (with live reload)
hugo server -disableFastRender

# Build for production (outputs to docs/ folder)
hugo --minify
```

## Publishing Workflow

1. Run `hugo server -disableFastRender` to preview changes locally
2. Run `hugo --minify` to generate production files in `docs/`
3. Commit all changes including the `docs/` folder
4. Push to GitHub - the site auto-deploys from the docs folder

## Content Structure

Posts use **leaf bundles** - each post is a folder containing `index.md` plus any images:
```
content/posts/
├── blog/
│   └── hugo/
│       ├── index.md      # Post content
│       └── image.png     # Co-located images
└── archives/
    └── aws-bastion/
        ├── index.md
        └── 2020-11-17-10-13-49.png
```

## Front Matter Template

```toml
+++
title = 'Post Title'
date = 2024-09-02
categories = ["Category"]
toc = true
+++
```

## Theme Customizations

The theme is a git submodule at `themes/hugo-blog-awesome` - do not modify files there directly.

Local overrides are in:
- `layouts/partials/head.html` - Custom CSS/JS includes, uses local `main.scss`
- `layouts/partials/footer.html` - Footer customization
- `layouts/_default/terms.html` - Category page layout
- `assets/sass/main.scss` - Width and main styling overrides
- `assets/sass/custom.scss` - Additional custom styles
- `static/css/copy-code.css` and `static/js/copy-code.js` - Code block copy button
