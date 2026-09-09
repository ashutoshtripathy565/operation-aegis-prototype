const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.click('button.btn-cyber-primary');
    await new Promise(r => setTimeout(r, 1000));
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Personnel')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));
    const rootContent = await page.evaluate(() => document.getElementById('root').innerHTML);
    fs.writeFileSync('dom_output.html', rootContent, 'utf8');
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
