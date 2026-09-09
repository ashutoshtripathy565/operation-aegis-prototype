const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  try {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const page = await browser.newPage();

    let hasError = false;

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('BROWSER CONSOLE ERROR:', msg.text());
        hasError = true;
      }
    });

    page.on('pageerror', error => {
      console.log('BROWSER PAGE ERROR (Uncaught Exception):', error.message);
      hasError = true;
    });

    console.log('Navigating to app...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
    
    console.log('Attempting to go to login...');
    await page.click('button.btn-cyber-primary');
    await new Promise(r => setTimeout(r, 1000));

    console.log('Clicking Commander Batra Login...');
    const buttons = await page.$$('button');
    let clicked = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Commander')) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    
    if (!clicked) {
        console.log('Login button not found!');
    }

    await new Promise(r => setTimeout(r, 2000));

    const rootContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.innerHTML : '';
    });
    
    if (!rootContent || rootContent.trim() === '') {
      console.log('RESULT: PAGE CRASHED AFTER LOGIN (root div is empty)');
    } else if (hasError) {
      console.log('RESULT: PAGE RENDERED BUT HAS ERRORS');
    } else {
      console.log('RESULT: LOGIN SUCCESSFUL NO ERRORS');
      if (rootContent.includes('Welfare monitoring active')) {
         console.log('Verified dashboard rendered successfully!');
      } else {
         console.log('Dashboard content not detected. Content length:', rootContent.length);
      }
    }
    
    await browser.close();
  } catch (err) {
    console.error('Error in script:', err);
  }
})();
