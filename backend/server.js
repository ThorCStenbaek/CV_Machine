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



/*
const j = [
    {
        "caption": "Blanketter & information",
        "description": "Blanketter och Information"
    },
    {
        "caption": "Övrigt",
        "description": "Övrigt"
    }
]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const myFunction = async () => {
  for (let i = 0; i < j.length; i++) {
    console.log("inserting", j[i].caption);
    await dbUtils.categories.insertCategory(j[i].caption, j[i].description, 1, 12);
    await delay(100); // Delay for 100 milliseconds
  }
};

myFunction();

*/


//dbUtils.createAllTables()
/*
dbUtils.files.insertFileCategory("Bad")
dbUtils.files.insertFileCategory("Barnets hälsa")
dbUtils.files.insertFileCategory("Första hjälpen")
dbUtils.files.insertFileCategory("Kläder")
dbUtils.files.insertFileCategory("Livsmedel")
dbUtils.files.insertFileCategory("Övrigt")
dbUtils.files.insertFileCategory("Personlig hygien")
dbUtils.files.insertFileCategory("Sakerhet")
dbUtils.files.insertFileCategory("Samspel & lek")
dbUtils.files.insertFileCategory("Säng & sömn")
dbUtils.files.insertFileCategory("Städa & tvätta")
*/

//dbUtils.files.insertFileCategory("resursbilder")

/*
dbUtils.files.rights.insertIntoRightsId("https://openclipart.org/")

dbUtils.files.rights.insertIntoRightsId("https://mulberrysymbols.org/")

dbUtils.files.rights.insertIntoRightsId("http://tawasolsymbols.org/")

dbUtils.files.rights.insertIntoRightsId("http://arasaac.org/")
*/
//dbUtils.parent.updateParentUserIdsForSosuUser(1, [2,3])
//dbUtils.parent.getParentUserIdsForSosuUser(1).then(result => console.log(result))
//dbUtils.parent.addResourceToUser(15, 1).then(result => console.log(result))
//dbUtils.parent.addResourceToUser(15, 2).then(result => console.log(result))
//dbUtils.parent.addResourceToUser(15, 3).then(result => console.log(result))

//dbUtils.editors.insertEditor("Advanced Editor", "Editor that let's you make multiple rows and columns", "admin")

//testdb.initialDatabase()
//testdb.initialDatabase().then(()=> testdb.insertAllCategories()).then(()=>testdb.insertRandomResources(80));

//dbUtils.user.insertUser("test", "test@test.dk", "testFN", "testLN", "test", "ADMIN")

//timeout
/*
setTimeout(() => {
  const li = generateScreenshots(1).then(result => console.log("THE LIST",result))

}, 5000);
*/

//dbUtils.resources.screenshots.createResourceImagePathTable()

//dbUtils.files.getFileByID(1).then(data => console.log(data))
//dbUtils.files.getFileByID(2).then(data=>console.log(data))
//console.log(dbUtils.files.getFileByID(0))
//dbUtils.categories.unfoldCategories().then(result => console.log(result))
    //testdb.insertRandomResources(1)
/*
   dbUtils.resources.getResourcesByCategory(1).then(result => {
        console.log("result: ",result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    




       dbUtils.resources.getResourceMetaByResourceId(5).then(result => {
        console.log("meta: ",result);
    })
    .catch(error => {
        console.error('Error:', error);
    });

*/



//dbUtils.resources.createResourceLastUpdatedTable()

app.get('/test', (req, res) => {
    res.send("Hello there")
})

//should refactor. This works for now, but we should save pdfs on the server and then 
//deliver them.
app.get('/api/generate-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Extract query parameters
    const targetUrl = req.query.url; // The URL to navigate to
    const isLandscape = req.query.landscape === 'true'; // Whether the PDF should be in landscape

    // Validate the URL parameter
    if (!targetUrl) {
      res.status(400).send('URL parameter is required');
      return;
    }

    // Assuming cookies are sent with the request, set them in Puppeteer
    let cookies = [];
    const cookiesStr = req.headers.cookie;
    if (cookiesStr) {
      cookies = cookiesStr.split(';').map(pair => {
        const [name, value] = pair.split('=').map(s => s.trim());
        return { name, value, url: targetUrl }; // Use the URL from the query parameter
      });
      await page.setCookie(...cookies);
    }

    // Navigate to the provided URL
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.page-container', { timeout: 5000 });

    // Optional: Modify styles of .page-container elements
    await page.evaluate(() => {
      const containers = document.querySelectorAll('.page-container');
      containers.forEach(el => {
        el.style.padding = '0px';
          el.style.boxShadow = 'none';

      });
    });

    // Concatenate all .page-container elements
    const fullHtml = await page.$$eval('.page-container', elements => 
      elements.map(e => e.outerHTML + '<div style="page-break-after: always;"></div>').join(''));

    if (!fullHtml) {
      res.status(404).send('No elements found');
      return;
    }

    // Create a new page for the concatenated HTML
    const pdfPage = await browser.newPage();
    if (cookies.length > 0) {
      await pdfPage.setCookie(...cookies);
    }

    await pdfPage.setContent(fullHtml, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
    const pdfBuffer = await pdfPage.pdf({
      format: 'A4',
      printBackground: true,
      landscape: isLandscape, // Set landscape based on query parameter
    });
    
    await pdfPage.close();
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=element-page.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF');
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




