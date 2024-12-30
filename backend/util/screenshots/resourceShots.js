const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');


async function generateScreenshots(baseNumber) {
    const domainName = process.env.DOMAIN_URL || 'http://localhost:8000';
    const screenshotsDir = path.join(__dirname, 'resource_images');
    fs.mkdirSync(screenshotsDir, { recursive: true });  // Ensure the directory exists

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set viewport dimensions as per previous successful captures
        await page.setViewport({ width: 1920, height: 1080 });

        // Log in to set the cookie automatically via an endpoint
        const loginUrl = `${domainName}/api/set-cookie`;  // Login URL
        const response = await axios.post(loginUrl, {
            identifier: 'thor',  // These should be configured accordingly
            password: 'thor'
        }, {
            withCredentials: true
        });

        // Use cookies from login response in Puppeteer
        const cookies = response.headers['set-cookie'].map(cookieStr => {
            const [nameValue, ...rest] = cookieStr.split(';');
            const [name, value] = nameValue.split('=');
            return { name, value, domain: new URL(domainName).hostname };
        });
        await page.setCookie(...cookies);

        const targetUrl = `${domainName}/resource${baseNumber}`;
        await page.goto(targetUrl, { waitUntil: 'networkidle2' });

        // Wait for the container to render and modify its styles
        await page.waitForSelector('.page-container', { timeout: 5000 });
        await page.evaluate(() => {
            document.querySelectorAll('.page-container').forEach(el => {
                el.style.padding = '0px';
                el.style.boxShadow = 'none';
                el.style.overflow = 'visible';
            });
        });

        const containers = await page.$$('.page-container');
        if (containers.length === 0) {
            await browser.close();
            throw new Error('No .page-container elements found');
        }

        let screenshotFiles = [];
        for (let i = 0; i < containers.length; i++) {
            const element = containers[i];
            const boundingBox = await element.boundingBox();
            if (!boundingBox) {
                continue;  // Skip if bounding box is null (element might be hidden)
            }

            const screenshotPath = path.join(screenshotsDir, `res${baseNumber}_${i + 1}.png`);
            await element.screenshot({
                path: screenshotPath,
                type: 'png',
                clip: {  // Use clip to capture the exact area of the element
                    x: boundingBox.x,
                    y: boundingBox.y,
                    width: Math.min(boundingBox.width, 1920),  // Ensure width does not exceed the viewport's width
                    height: boundingBox.height
                }
            });
            screenshotFiles.push(screenshotPath);
        }

        await browser.close();
        return screenshotFiles.map(file => path.basename(file));  // Return the list of file names
    } catch (error) {
        console.error('Error in generateScreenshots:', error);
        throw error;  // Rethrow the error after logging it
    }
}

module.exports = {generateScreenshots}; // Export the function
