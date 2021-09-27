//////////////////////////////////////////////////////////////////////
// miniquery unit test - using Puppeteer to emulate browser context
// Note: The first test may fail due to Puppeteer's built-in Chromium
// browser taking longer than async timeout to boot.
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
    
    it('should compute dimensions', async () => {
        const page = await open('file:' + path.resolve(pathPages, 'dimensions.html'));
        
        const [pageW, pageH] = await page.evaluate(() => [document.body.offsetWidth, document.body.offsetHeight]);
        async function testDimensions(el, expected) {
            // location test
            if ('x' in expected || 'y' in expected) {
                const [x, y] = await page.evaluate(`domops('${el}').location()[0]`);
                if ('x' in expected) assert.strictEqual(x, expected.x, `unexpected x offset on ${el}`);
                if ('y' in expected) assert.strictEqual(y, expected.y, `unexpected y offset on ${el}`);
            }
            
            // size test
            if ('w' in expected || 'h' in expected) {
                const [w, h] = await page.evaluate(`domops('${el}').size()[0]`);
                if ('w' in expected) assert.strictEqual(w, expected.w, `unexpected width on ${el}`);
                if ('h' in expected) assert.strictEqual(h, expected.h, `unexpected height on ${el}`);
            }
            
            // box test
            if ('x' in expected || 'y' in expected) {
                const [l, t, r, b] = await page.evaluate(`domops('${el}').box({absolute: true})[0]`);
                assert.strictEqual(l, expected.x, `unexpected box left on ${el}`);
                assert.strictEqual(t, expected.y, `unexpected box top on ${el}`);
                if ('w' in expected) assert.strictEqual(r, expected.x + expected.w, `unexpected box right on ${el}`);
                if ('h' in expected) assert.strictEqual(b, expected.y + expected.h, `unexpected box bottom on ${el}`);
            }
            
            // cssBox test
            if ('tlrb'.split('').find(prop => prop in expected)) {
                const {top: t, left: l, right: r, bottom: b} = await page.evaluate(`domops('${el}').cssBox()[0]`);
                if ('t' in expected) assert.strictEqual(t, expected.t, `unexpected cssBox top on ${el}`);
                if ('l' in expected) assert.strictEqual(l, expected.l, `unexpected cssBox left on ${el}`);
                if ('r' in expected) assert.strictEqual(r, expected.r, `unexpected cssBox right on ${el}`);
                if ('b' in expected) assert.strictEqual(b, expected.b, `unexpected cssBox bottom on ${el}`);
            }
        }
        
        await testDimensions('#wrapper', {
            x: 0,
            y: 0,
            w: pageW,
            h: pageH,
            
            t: 0,
            l: 0,
            r: 0,
            b: 0,
        });
        
        await testDimensions('#header', {
            x: 0,
            y: 0,
            w: pageW,
            h: 50,
            
            t: 0,
            l: 0,
            r: 0,
            b: pageH-50,
        });
        
        await testDimensions('#content', {
            x: 0,
            y: 50,
            w: pageW,
            
            t: 50,
            l: 0,
            r: 0,
        });
        
        await testDimensions('#title', {
            x: 0,
            y: 50,
            t: 0,
            l: 0,
            r: 0,
        });
        
        await testDimensions('#footer', {
            x: 0,
            y: pageH-60,
            w: pageW,
            h: 60,
            t: pageH-60,
            l: 0,
            r: 0,
            b: 0,
        });
    });
});

async function open(url) {
    const browser = await puppeteer.launch();
    const page = await browser.defaultBrowserContext().newPage();
    await page.goto(url);
    await page.addScriptTag({path: path.resolve(__dirname, '../dist/domops.js')});
    // auto-close after 10 seconds - does not prevent script from terminating
    setTimeout(() => {
        browser.close();
    }, 10000).unref();
    return page
}
