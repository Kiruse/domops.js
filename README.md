# domops.js
A minimalist's interpretation of jQuery for DOM traversal &amp; manipulation.

- [domops.js](#domopsjs)
- [setup](#setup)
- [embedding](#embedding)
- [usage](#usage)
  - [web scraping with puppeteer](#web-scraping-with-puppeteer)
- [license](#license)

# setup

There's different ways to acquire a copy of domops:

* via NPM: `npm i --save domops`
* via Releases

Currently, domops is not deployed to any CDN.


# embedding

**domops** requires a DOM and can thus only be used in a browser-like environment, such as [Electron](https://www.electronjs.org/) or an actual browser.

In the browser, one may include it as such:

```html
<!-- UMD -->
<script src="<path_to_domops>/miniuqery.js"></script>
<script>
    "use strict";
    const $ = domops;
    // ...
</script>

<!-- ESModules -->
<script type="module">
    import $ from './path_to/domops.esm.js';
    // ...
</script>
```

Personally, I prefer packaging it with [Webpack](https://webpack.js.org) or other web bundlers. For this, you'd simply import it like so:

```javascript
// using ESModules
import domops from 'domops';

// using CommonJS
const domops = require('domops');
```

And the bundler will handle the rest.


# usage

*TODO*

## web scraping with puppeteer
Unfortunately, domops requires a DOM. You may use it with [node-dom](https://www.npmjs.com/package/node-dom), or with the more popular [Puppeteer](https://github.com/puppeteer/puppeteer/). While the former is suited for an assortment of tasks, *Puppeteer* is certainly more thoroughly tested and will be able to handle any task that its associated Chrome version can - albeit at the cost of increased complexity. *domops*'s unit tests are written with *Puppeteer*.

**Example**
In node:
```javascript
const puppeteer = require('puppeteer');

(async function() {
    const browser = await puppeteer.launch();
    const context = browser.defaultBrowserContext();
    const page    = await context.newPage();
    
    // load web page by URL - include protocol
    await page.goto('https://google.com');
    
    // inject domops library via URL or local file path
    await page.addScriptTag({url: '<url_to_domops>'});
    await page.addScriptTag({path: './node_modules/domops/domops.js'});
    
    const logosize = await page.evaluate(() => {
        // execute web scraping code in the context of the browser page
        const $logo = domops('#hplogo');
        return {
            width:  parseFloat($logo.style('width')[0]),
            height: parseFloat($logo.style('height')[0]),
        }
    });
})();
```

# license

MIT License

Copyright (c) 2021 Kiruse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
