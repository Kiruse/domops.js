//////////////////////////////////////////////////////////////////////
// miniquery unit test - using Puppeteer to emulate browser context
// -----
// Copyright (c) Kiruse 2021. Licensed under MIT License
const assert = require('assert');
const path   = require('path');
const puppeteer = require('puppeteer');
const pathPages = path.resolve(__dirname, 'pages');

describe('domops', () => {
    it('should query DOM', async () => {
        const page = await open('file:' + path.resolve(pathPages, 'query.html'));
        
        const h1 = await page.evaluate(() => domops('#header h1').text()[0]);
        assert.strictEqual(h1, 'Welcome');
        
        const spans = await page.evaluate(() => domops('#wrapper .box span').text());
        assert.strictEqual(spans[0], 'revolutionary');
        assert.strictEqual(spans[1], 'amazing');
        
        const imgurl = await page.evaluate(() => domops('#wrapper .box img').attr('src')[0]);
        assert.strictEqual(imgurl, '/assets/img/some_image.jpg');
        
        const form = await page.evaluate(() => {
            const $form = domops('form');
            return {
                action:  $form.attr('action')[0],
                name:    $form.query('input[name=name]')[0].value,
                email:   $form.query('input[name=email]')[0].value,
                subject: $form.query('input[name=subject]')[0].value,
                message: $form.query('textarea')[0].value,
            }
        });
        assert.strictEqual(form.action, '/submit.php');
        assert.strictEqual(form.name,    'Sam Fisher');
        assert.strictEqual(form.email,   'sam@fisher.net');
        assert.strictEqual(form.subject, 'hello :)');
        assert.strictEqual(form.message, 'how\'s your day been? :)');
        
        await page.browser().close();
    });
});

async function open(url) {
    const browser = await puppeteer.launch();
    const page = await browser.defaultBrowserContext().newPage();
    await page.goto(url);
    await page.addScriptTag({path: path.resolve(__dirname, '../src/domops.js')});
    // auto-close after 10 seconds - does not prevent script from terminating
    setTimeout(() => {
        browser.close();
    }, 10000).unref();
    return page
}
