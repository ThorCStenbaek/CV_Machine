const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const cors = require('cors');
//const React = require('react'); //remmber to unintall
//const ReactDOMServer = require('react-dom/server'); //remember to uninstall
const puppeteer = require('puppeteer');
const fs = require('fs');


const cookieRoutes = require('./routes/cookie/cookieRoutes'); // Import the routes
const categoryRoutes = require('./routes/categories/categoriesRoutes');
const resourceRoutes = require('./routes/resources/resourceRoutes');
const resourceTypes =require('./routes/resources/resourceTypes');
const userRoutes = require('./routes/users/userRoutes');
const uploadRoutes = require('./routes/file_upload/uploading_files');
const editorRoutes = require('./routes/editors/editorRoutes');
const dbUtils = require('./util/database/database'); //nice and packed
const bodyParser = require('body-parser');
const testdb =require('./util/tests/create_test_data');
const checkCookie= require('./routes/cookie/cookieChecker')
const groupRoutes= require('./routes/users/groupRoutes');
const { group } = require('console');
const COOKIE_SECRET= "njcsuhcOJDASJD9EW80SNID9ASJDI9HEWUHZ87EUFE9FHSUNF79ESOIPFJPSUFNSUGYF"
const fileRoutes = require('./routes/files/fileRoutes')
const fileCategoriesRoutes = require('./routes/files/fileCategoriesRoutes')
const resourceToParentRoutes = require('./routes/resources/resourceToParentsRoutes')
const tokenRoutes = require('./routes/tokens/tokenRoutes')
const appResourceRoutes = require('./routes/resources/resourceToAppRoutes')
const fileRightsRoutes = require('./routes/files/fileRightsRoutes')
const { db } = require('./util/database/database_core');

const  {generateScreenshots }= require('./util/screenshots/resourceShots')


var app = express()

app.use(bodyParser.json());

app.use(cors()) //just allow all
app.use(cookieParser(COOKIE_SECRET))





app.use('/api', appResourceRoutes); // Use the routes
app.use('/api', tokenRoutes); // Use the token  routes
app.use('/api', cookieRoutes); // Use the routes

app.use('/api', fileRoutes)
app.use('/api', fileCategoriesRoutes)
app.use('/api',categoryRoutes)
app.use('/api', resourceRoutes)
app.use('/api', userRoutes)
app.use('/api', groupRoutes)

app.use('/api', resourceTypes )

app.use('/api', uploadRoutes)
app.use('/api', editorRoutes)

app.use('/api', resourceToParentRoutes)
//app.use('/uploads', checkCookie, express.static('uploads'));
app.use('/api', fileRightsRoutes)


app.use('/uploads/public', express.static(path.join(__dirname, 'uploads/public'))); // serve public files
app.use('/uploads/private', checkCookie, express.static(path.join(__dirname, 'uploads/private')));


//dbUtils.createAllTables();





app.get('/test', (req, res) => {
    res.send("Hello there")
})

//should refactor. This works for now, but we should save pdfs on the server and then 
//deliver them.
app.get('/api/generate-pdf', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true, // ✅ BACK TO HEADLESS
    args: ['--start-maximized'],
    defaultViewport: null
  });

  try {
    const isLandscape = req.query.landscape === 'true';
    const targetUrl = 'http://localhost:8000/resource4';

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => {
        const [name, value] = c.trim().split('=');
        return { name, value, url: targetUrl };
      });
      await page.setCookie(...cookies);
    }

    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'debug-initial.png', fullPage: true });

    const containersHTML = await page.$$eval('.page-container', els =>
      els.map(e => e.outerHTML + '<div style="page-break-after:always;"></div>').join('')
    );
    if (!containersHTML) {
      res.status(404).send('No .page-container elements found');
      return;
    }

    const stylesHTML = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
      return styles.map(el => el.outerHTML).join('');
    });

    const fullHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        ${stylesHTML}
        <style>
          @page {
            size: ${isLandscape ? '297mm 210mm' : '210mm 297mm'};
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
          }
          .page-container {
            width: 100% !important;
            height: 1122.52px !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        </style>
      </head>
      <body>
        ${containersHTML}
      </body>
      </html>
    `;

    const pdfPage = page; // still using same page
    await pdfPage.setContent(fullHTML, { waitUntil: 'networkidle0' });
    await pdfPage.emulateMediaType('print');
    await pdfPage.screenshot({ path: 'debug-pdf-content.png', fullPage: true });


    const pdf = await pdfPage.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="element-page.pdf"');
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
  } finally {
    await browser.close();
  }
});








app.get('/api/generate-screenshot', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add sandbox options for Docker or certain deployment environments
    });
    const page = await browser.newPage();

    // Extract query parameters
    const targetUrl = req.query.url; // The URL to navigate to
    if (!targetUrl) {
      res.status(400).send('URL parameter is required');
      return;
    }

    await page.setViewport({
      width: 1920, // Set width to a wide enough value
      height: 1080 // Standard height
    });

    let cookies = [];
    const cookiesStr = req.headers.cookie;
    if (cookiesStr) {
      cookies = cookiesStr.split(';').map(pair => {
        const [name, value] = pair.split('=').map(s => s.trim());
        return { name, value, url: targetUrl }; // Use the URL from the query parameter
      });
      await page.setCookie(...cookies);
    }

    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    const selectors = await page.waitForSelector('.page-container', { timeout: 5000 });

    // Modify styles to ensure elements are fully visible
    await page.evaluate(() => {
      document.querySelectorAll('.page-container').forEach(el => {
        el.style.padding = '0px';
        el.style.boxShadow = 'none';
        el.style.overflow = 'visible'; // Make sure overflow does not hide the content
      });
    });

    const containers = await page.$$('.page-container');
    if (containers.length === 0) {
      await browser.close();
      res.status(404).send('No .page-container elements found');
      return;
    }

    // Prepare the directory for screenshots
    const screenshotsDir = path.join(__dirname, 'screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });

    let screenshotFiles = [];

    for (let i = 0; i < containers.length; i++) {
      const element = containers[i];
      const boundingBox = await element.boundingBox();
      if (!boundingBox) {
        continue; // Skip if bounding box is null (element might be hidden)
      }
      const screenshotPath = path.join(screenshotsDir, `screenshot${i + 1}.png`);
      await element.screenshot({
        path: screenshotPath,
        type: 'png',
        clip: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: Math.min(boundingBox.width, 1920),
          height: boundingBox.height
        }
      });
      screenshotFiles.push(screenshotPath);
    }

    await browser.close();

    // Respond with the list of screenshot file paths
    res.status(200).json({
      message: 'Screenshots generated successfully',
      files: screenshotFiles.map(file => path.basename(file)) // Return only the file names
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating screenshots');
  }
});







app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'))

})



const PORT= process.env.PORT || 8000

app.listen(PORT, () => console.log("Listening on port ", PORT))


// Handle graceful shutdown
process.on('SIGINT', () => {
  dbUtils.closeConnection();
  process.exit();
});




