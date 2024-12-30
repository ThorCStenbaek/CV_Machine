const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Replace the URL with your React app's specific path
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });

    // Optionally, adjust PDF options here
    await page.pdf({ path: 'page.pdf', format: 'A4' });

    await browser.close();
})();
