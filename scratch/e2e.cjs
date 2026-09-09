const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let passed = true;
  
  try {
    console.log("Navigating to app...");
    await page.goto('http://localhost:5173');
    
    console.log("STEP 1: Admin login");
    // Ensure we wait for the Login screen
    await page.waitForSelector('button');
    // We need to click "System Admin" quick login. 
    // In Login.jsx, buttons have the role name. Let's find the admin button.
    const buttons = await page.$$('button');
    let adminBtn, s001Btn, medBtn, cmdBtn;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('System Admin')) adminBtn = btn;
      if (text.includes('S001')) s001Btn = btn;
      if (text.includes('Medical')) medBtn = btn;
      if (text.includes('Commander')) cmdBtn = btn;
    }
    await adminBtn.click();
    
    console.log("STEP 2: Reset synthetic demo data");
    await page.waitForSelector('button');
    const adminPanelBtns = await page.$$('button');
    let resetBtn;
    for (const btn of adminPanelBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('RESET SYNTHETIC DEMO DATA')) resetBtn = btn;
    }
    
    if(resetBtn) {
       // Mock the confirm dialog
       page.on('dialog', async dialog => { await dialog.accept(); });
       await resetBtn.click();
       await new Promise(r => setTimeout(r, 500));
    }

    console.log("Logging out Admin...");
    const logoutBtn = await page.$('button[title="Secure Log Out"]');
    if(!logoutBtn) {
        // AppShell header has a button with text "Secure Log Out" or title
        const headerBtns = await page.$$('button');
        for (const btn of headerBtns) {
          const text = await page.evaluate(el => el.textContent, btn);
          if (text.includes('Log Out')) await btn.click();
        }
    } else {
        await logoutBtn.click();
    }
    
    console.log("STEP 3: Login as S001");
    await page.waitForSelector('button');
    const loginBtns2 = await page.$$('button');
    for (const btn of loginBtns2) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('S001')) await btn.click();
    }

    console.log("STEP 4: Verify first Soldier screen is daily assessment");
    await page.waitForSelector('button');
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (!bodyText.includes("Today's Check-in")) {
      console.error("Missing Today's Check-in screen");
      passed = false;
    }

    console.log("STEP 5: Complete daily wellbeing assessment");
    const beginBtn = await page.$$('button');
    for (const btn of beginBtn) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Begin Assessment')) await btn.click();
    }
    
    await page.waitForSelector('form');
    const submitBtn = await page.$$('button');
    for (const btn of submitBtn) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Submit Securely')) await btn.click();
    }

    console.log("Waiting for processing state to complete...");
    await new Promise(r => setTimeout(r, 1500));

    const postSubmitText = await page.evaluate(() => document.body.innerText);
    if (!postSubmitText.includes('Assessment Complete')) {
      console.error("Missing Assessment Complete confirmation");
      passed = false;
    }

    console.log("STEP 7 & 8: Verify streak calculation and daily message");
    if (!postSubmitText.includes('day streak') && !postSubmitText.includes('days strong') && !postSubmitText.includes('Showing up matters')) {
       console.error("Could not find expected streak text");
       passed = false;
    }

    console.log("Test execution completed successfully.");
    
  } catch (err) {
    console.error("Test failed with error:", err);
    passed = false;
  } finally {
    await browser.close();
    process.exit(passed ? 0 : 1);
  }
})();
