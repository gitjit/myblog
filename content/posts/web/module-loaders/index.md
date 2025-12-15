+++
title = 'Webpack/SystemJS'
date = 2023-12-14
categories = ["web"]
toc = true
+++

## The Module Loading Journey

JavaScript module loading is one of those topics that seems simple on the surface but reveals incredible depth once you start digging. I recently spent several weeks building a comprehensive lab to understand how JavaScript modules are loaded, bundled, and delivered to browsers. This post shares everything I learned, complete with actual code from the projects I built.

## The Problem: Why Module Loaders Exist

Before we had module systems, JavaScript development was chaotic. Here's what a typical website looked like:

```html
<!DOCTYPE html>
<html>
<body>
    <h1>Welcome!</h1>

    <!-- Load all our JavaScript files -->
    <script src="js/jquery.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/validation.js"></script>
    <script src="js/api.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

This approach had four critical problems:

### Problem 1: Order Matters (A Lot!)

If `app.js` uses a function from `utils.js`, you must load `utils.js` first:

```js
// utils.js
function formatDate(date) {
    return date.toLocaleDateString();
}

// app.js
const today = formatDate(new Date());  // Uses formatDate from utils.js
console.log(today);
```

Swap the order in your HTML and you get: `Uncaught ReferenceError: formatDate is not defined`

With 5 files this is annoying. With 50 files? A nightmare.

### Problem 2: Everything is Global

```js
// utils.js
var name = "Utils Helper";
function formatDate(date) { ... }

// api.js
var name = "API Module";  // Oops! Overwrites the previous 'name'
function formatDate(response) { ... }  // Oops! Overwrites the function!
```

As teams grow, name collisions become inevitable.

### Problem 3: Slow Page Loads

Each `<script>` tag = separate HTTP request:
- 5 files = 5 round trips to the server
- On a slow connection, users stare at blank pages

### Problem 4: No Dependency Tracking

Looking at a file, you can't tell what it depends on without reading through everything.

## The Solution: Modules

Developers thought: "What if each file could explicitly declare what it needs and provides?"

```js
// utils.js - A module that EXPORTS functionality
export function greet(name) {
    return `Hello, ${name}!`;
}

export function formatDate(date) {
    return date.toLocaleDateString();
}

// app.js - A module that IMPORTS what it needs
import { greet, formatDate } from './utils.js';

const message = greet('World');
const today = formatDate(new Date());

console.log(message);
console.log(`Today is: ${today}`);
```

**Benefits:**
- Clear dependencies (we see `app.js` needs `utils.js`)
- No global pollution (variables stay inside modules)
- Order is automatic (the system figures it out)

**The catch:** Browsers didn't support this! Enter build tools.

## The Two Worlds of Module Loading

My exploration revealed two fundamentally different approaches:

### 1. Build-Time Bundling (Webpack)

Webpack processes code **before deployment**:

```
Your modular code → [Webpack Build] → bundle.js → Browser loads once
```

**How it works:**
1. Starts at entry point (`index.js`)
2. Follows all imports, building a dependency graph
3. Bundles everything into one (or few) optimized files
4. Transforms non-JavaScript files using loaders

**Pros:** One HTTP request, optimized, tree-shaking, minification
**Cons:** Large initial download, rebuild needed for changes

### 2. Runtime Loading (SystemJS)

SystemJS loads modules **in the browser** when needed:

```
Browser runs → Needs module → Fetches it → Needs another → Fetches it
```

**Pros:** Smaller initial load, true lazy loading
**Cons:** Many HTTP requests, no build-time optimization

## Building Custom Webpack Loaders

My biggest "aha!" moment: **loaders are just functions**.

Webpack only understands JavaScript. Try to import CSS:

```js
import './styles.css';
```

Webpack says: "I don't understand `.css`!"

That's where loaders come in.

### Anatomy of a Loader

A loader is a function that:
1. Receives file content as a string
2. Transforms it
3. Returns JavaScript

Here's the complete custom banner loader I built:

```js
// loaders/banner-loader.js

/**
 * A loader is just a function that:
 * 1. Receives file content (as a string)
 * 2. Transforms it
 * 3. Returns the transformed content
 */
function bannerLoader(content) {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Create a banner comment
    const banner = `// Built with Webpack - ${today}\n`;

    // Prepend banner to the original content
    return banner + content;
}

// Export the loader function (CommonJS style - required by webpack)
module.exports = bannerLoader;
```

That's it! The fancy loaders like `babel-loader` and `css-loader` follow the same pattern - they just do more complex transformations.

### Using the Custom Loader

Configure it in `webpack.config.js`:

```js
const path = require('path');

module.exports = {
    entry: './src/index.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    mode: 'development',

    module: {
        rules: [
            {
                test: /\.js$/,            // Match .js files
                exclude: /node_modules/,  // Don't process node_modules
                use: [
                    path.resolve(__dirname, 'loaders/banner-loader.js'),
                ],
            },
        ],
    },
};
```

Now every JavaScript file gets the banner comment!

### Building a CSS Loader from Scratch

To truly understand CSS loaders, I built `simple-css-loader` that combines what `css-loader` and `style-loader` do:

```js
// loaders/simple-css-loader.js

function simpleCssLoader(cssContent) {
    // Escape the CSS for use in a JavaScript template string
    const escaped = cssContent
        .replace(/\\/g, '\\\\')   // Escape backslashes
        .replace(/`/g, '\\`')     // Escape backticks
        .replace(/\$/g, '\\$');   // Escape dollar signs

    // Return JavaScript code that injects CSS into the DOM
    return `
// ===== Generated by simple-css-loader =====

// Step 1: The CSS content (as a JavaScript string)
const css = \`${escaped}\`;

// Step 2: Create a <style> element
const style = document.createElement('style');

// Step 3: Put the CSS text inside the <style> element
style.textContent = css;

// Step 4: Append the <style> element to <head>
document.head.appendChild(style);

// Step 5: Log to console so we can see it working
console.log('[simple-css-loader] Injected styles');

// ===== End of generated code =====
    `;
}

module.exports = simpleCssLoader;
```

**Key insight:** CSS doesn't remain as CSS in your bundle. It becomes JavaScript code that creates a `<style>` tag at runtime!

When you import CSS:

```js
import './styles.css';
```

The loader transforms it to JavaScript:

```js
const css = `body { background: blue; }`;
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
```

No separate CSS file exists - it's all JavaScript in the bundle!

## SystemJS and the System.register Format

SystemJS was created in 2014 before browsers supported ES6 modules. It uses its own format called `System.register`.

Here's the transformation:

**ES6 (what you write):**
```js
// utils.js
export function greet(name) {
    return `Hello, ${name}!`;
}

// main.js
import { greet } from './utils.js';
const message = greet('World');
```

**System.register (what SystemJS needs):**
```js
// utils.js
System.register([], function (exports) {
    'use strict';
    return {
        execute: function () {
            exports('greet', function greet(name) {
                return `Hello, ${name}!`;
            });
        }
    };
});

// main.js
System.register(['./utils.js'], function (exports, context) {
    'use strict';
    var greet;

    return {
        setters: [
            function (utils) {
                greet = utils.greet;
            }
        ],
        execute: function () {
            var message = greet('World');
        }
    };
});
```

Nobody writes this by hand! Use Babel with `@babel/plugin-transform-modules-systemjs`:

```json
{
  "plugins": [
    "@babel/plugin-transform-modules-systemjs"
  ]
}
```

Then run: `babel src --out-dir dist`

## The Power Move: Combining Webpack + SystemJS

Here's where it gets powerful. Use **both** tools together!

### Lazy Loading Pattern

Webpack creates multiple bundles in `System.register` format, SystemJS loads them on-demand.

**Webpack config:**
```js
const path = require('path');

module.exports = {
    // MULTIPLE ENTRY POINTS = MULTIPLE BUNDLES
    entry: {
        'main-bundle': './src/main.js',
        'dashboard-bundle': './src/dashboard.js',
        'settings-bundle': './src/settings.js',
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),

        // THE MAGIC: Output in System.register format
        libraryTarget: 'system',
    },

    optimization: {
        splitChunks: false,  // Keep bundles separate
    },
};
```

**Main app shell (loads immediately):**
```js
// main.js - App Shell (small, loads fast)

function renderShell() {
    app.innerHTML = `
        <h1>Lazy Loading Demo</h1>
        <nav>
            <button id="btn-dashboard">Load Dashboard</button>
            <button id="btn-settings">Load Settings</button>
        </nav>
        <div id="content">
            <p>Click a button to lazy-load a module</p>
        </div>
    `;

    const contentDiv = document.getElementById('content');

    // Dashboard button - lazy loads dashboard bundle
    document.getElementById('btn-dashboard').addEventListener('click', () => {
        contentDiv.innerHTML = '<p>Loading dashboard...</p>';
        console.log('Fetching dashboard-bundle.js...');

        // SystemJS loads the bundle ON DEMAND
        System.import('./dist/dashboard-bundle.js')
            .then(module => {
                console.log('Dashboard loaded!', module);
                module.render(contentDiv);
            })
            .catch(err => {
                contentDiv.innerHTML = `<p>Error: ${err}</p>`;
            });
    });

    // Settings button - lazy loads settings bundle
    document.getElementById('btn-settings').addEventListener('click', () => {
        contentDiv.innerHTML = '<p>Loading settings...</p>';

        System.import('./dist/settings-bundle.js')
            .then(module => module.render(contentDiv));
    });
}

renderShell();
console.log('App shell loaded. Features load on-demand.');
```

**The result:**
- Initial load: 5 KB (main bundle only)
- Dashboard: 7 KB (loads only if clicked)
- Settings: 9 KB (loads only if clicked)
- **76% smaller initial download!**

Watch the Network tab in DevTools - you'll see bundles load on-demand.

## Micro-Frontends: Different Teams, Different Tools

One of my most fascinating projects demonstrated micro-frontends where different teams use different build tools.

### The Architecture

```
Team A (Header)     Team B (Widget)      Team C (Footer)
Uses Webpack        Uses Babel           Uses Webpack
Bundles files       Transform only       Bundles files
1 HTTP request      2 HTTP requests      1 HTTP request

         All combined by Shell at runtime via SystemJS
```

### Team B: Babel (No Bundling!)

This was the key learning: **Babel transforms, Webpack bundles**. They solve different problems!

**Webpack:**
```
widget.js + widget-data.js → [Webpack] → widget.bundle.js (ONE file)
```

**Babel:**
```
widget.js → [Babel] → widget.js (transformed, SEPARATE)
widget-data.js → [Babel] → widget-data.js (transformed, SEPARATE)
```

Team B's source code (ES6):

```js
// mfe-widget/src/widget.js - Written in clean ES6
import { getWidgetData } from './widget-data.js';

export function render(container) {
    const data = getWidgetData();

    const cardsHtml = data.cards
        .map(card => `
            <div class="widget-card">
                <span class="icon">${card.icon}</span>
                <span class="value">${card.value}</span>
                <span class="label">${card.label}</span>
            </div>
        `)
        .join('');

    container.innerHTML = `
        <div class="mfe-widget">
            <h2>${data.title}</h2>
            <div class="widget-cards">${cardsHtml}</div>
            <p>This MFE uses Babel - files stay separate!</p>
        </div>
    `;

    console.log('[MFE-Widget] Rendered! (Babel, no bundling)');
}

export const name = 'Widget Micro-frontend';
```

Their Babel config:

```json
{
  "plugins": [
    "@babel/plugin-transform-modules-systemjs"
  ]
}
```

Build: `babel src --out-dir dist`

After Babel runs, `widget.js` and `widget-data.js` stay as **separate files** but in `System.register` format.

### Why Choose Babel Over Webpack?

Team B chose Babel because:
- **Simpler config** (one plugin vs full webpack setup)
- **Files stay separate** (easier debugging)
- **Faster builds** (no bundling overhead)
- **Granular updates** (change one file without rebuilding everything)

### The Shell Combines Everything

```js
// shell/index.html
async function loadMFE(name, path, container) {
    const module = await System.import(path);
    module.render(document.getElementById(container));
    console.log(`✓ ${name} loaded`);
}

async function init() {
    // MFE 1: Header (Webpack bundle - 1 HTTP request)
    await loadMFE(
        'Header',
        '../mfe-header/dist/header.bundle.js',
        'header-container'
    );

    // MFE 2: Widget (Babel - 2 HTTP requests for 2 files)
    await loadMFE(
        'Widget',
        '../mfe-widget/dist/widget.js',
        'widget-container'
    );

    // MFE 3: Footer (Webpack bundle - 1 HTTP request)
    await loadMFE(
        'Footer',
        '../mfe-footer/dist/footer.bundle.js',
        'footer-container'
    );

    console.log('All micro-frontends loaded!');
}

init();
```

**Each team deploys independently, uses their tools, moves at their own pace!**

## Module Federation: Runtime Code Sharing

The final frontier: Webpack 5's Module Federation - sharing code between apps at runtime.

### The Setup

**App A (Provider) exposes a Button:**

```js
// app-a/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
    mode: 'development',
    entry: './src/index.js',

    output: {
        publicPath: 'http://localhost:3001/',
    },

    devServer: {
        port: 3001,
    },

    plugins: [
        new ModuleFederationPlugin({
            name: 'appA',
            filename: 'remoteEntry.js',
            exposes: {
                './Button': './src/Button.js',  // Share this!
            },
        }),
    ],
};
```

**App B (Consumer) uses App A's Button:**

```js
// app-b/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
    mode: 'development',
    entry: './src/index.js',

    output: {
        publicPath: 'http://localhost:3002/',
    },

    devServer: {
        port: 3002,
    },

    plugins: [
        new ModuleFederationPlugin({
            name: 'appB',
            remotes: {
                // "appA" = import name
                // URL = where to fetch from
                appA: 'appA@http://localhost:3001/remoteEntry.js',
            },
        }),
    ],
};
```

**In App B's code:**

```js
// App B dynamically imports from App A at runtime!
import('appA/Button').then(({ Button }) => {
    const btn = Button('Click me!');
    document.body.appendChild(btn);
});
```

### The Runtime Flow

```
1. User opens http://localhost:3002 (App B)

2. App B's code: import('appA/Button')

3. Browser: GET http://localhost:3001/remoteEntry.js

4. remoteEntry.js: "Button is in src_Button_js.chunk.js"

5. Browser: GET http://localhost:3001/src_Button_js.chunk.js

6. Button code now available in App B!
```

**Both apps must be running** - App B fetches from App A's server.

### Tradeoffs

| Benefit | Drawback |
|---------|----------|
| Always get latest code | Runtime dependency (if App A down, Button fails) |
| No npm publish cycle | Network latency |
| Independent deploys | Complex debugging |

## Key Learnings

### 1. Loaders Are Just Functions

Every Webpack loader - `babel-loader`, `css-loader`, `ts-loader` - is just a function:

```js
function myLoader(content) {
    // Transform content
    return transformedContent;
}
```

Understanding this demystifies the entire ecosystem.

### 2. CSS Becomes JavaScript

In Webpack bundles, CSS doesn't exist as CSS. It's JavaScript that injects `<style>` tags:

```js
const css = "body { background: blue; }";
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
```

### 3. Build-Time + Runtime = Best of Both Worlds

Don't choose between Webpack and SystemJS - use both!
- Webpack creates optimized bundles
- SystemJS loads them on-demand
- Result: Optimization + lazy loading

### 4. Babel ≠ Webpack

They solve different problems:
- **Babel**: Transforms syntax (ES6→ES5, JSX→JS, ESM→System.register)
- **Webpack**: Bundles multiple files into fewer files

Use Babel alone (transform only), Webpack alone (bundle), or both together.

### 5. libraryTarget: 'system' is the Bridge

This webpack config option makes bundles loadable by SystemJS:

```js
output: {
    libraryTarget: 'system'  // Outputs System.register format
}
```

### 6. Micro-Frontends Are Practical

Module Federation and SystemJS make micro-frontend architecture practical for large teams. Different teams can:
- Use different tools (Webpack, Babel, Rollup)
- Deploy independently
- Share code at runtime
- Move at their own pace

## Practical Recommendations

Based on building these projects, here's what I'd recommend:

**Small apps (<10 routes):**
Just use Webpack. Bundle everything. Simple.

```js
module.exports = {
    entry: './src/index.js',
    output: { filename: 'bundle.js' },
};
```

**Medium apps (10-50 routes):**
Webpack with code splitting for lazy loading:

```js
// Dynamic imports for heavy features
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
```

**Large apps (multiple teams):**
Micro-frontends with SystemJS or Module Federation:

```js
// Each team builds their bundle
// Shell loads them at runtime via SystemJS
System.import('./team-a/bundle.js');
System.import('./team-b/bundle.js');
```

**Libraries:**
Provide multiple formats (ESM, CommonJS, UMD) and let consumers choose their bundler.

## The Foundation Matters

Before diving into module loaders, I spent time understanding the web development lifecycle:

- **Web servers** (NGINX) deliver static files
- **Reverse proxies** route traffic between static files and APIs
- **React apps** are static files - JavaScript does everything in browser
- **Docker** ensures consistent runtime environments
- **Build tools** transform source into deployable assets

Module loaders exist within this broader context. Understanding the full picture helps make better architectural decisions.

## Conclusion

Module loaders bridge the gap between how we want to write code (modular, clean) and how browsers consume it (optimized, efficient). Understanding the difference between build-time bundling (Webpack) and runtime loading (SystemJS), knowing when to use each, and grasping how loaders transform files has fundamentally changed how I think about JavaScript architecture.

The web platform evolves constantly. Native ES modules in browsers are now standard, but build tools still solve real problems: optimization, tree-shaking, lazy loading, code splitting, and enabling large teams to work independently.

Whether you're building a simple site or a complex micro-frontend architecture, understanding these fundamentals empowers better decisions.

The complete lab with all projects is available in my learning repository - feel free to clone it and experiment!

Happy bundling!
