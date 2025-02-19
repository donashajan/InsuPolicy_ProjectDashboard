import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  secure: false,
  port: 465,
  auth: {
    user: 'your email',
    pass: 'your password'
  }
});

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
  const page = await browser.newPage();

  
 // Navigate the page to a URL
 await page.goto('https://developer.chrome.com/');


 // Type into search box
 await page.type('.devsite-search-field', 'automate beyond recorder');

 // Wait and click on first result
 const searchResultSelector = '.devsite-result-item-link';
 await page.waitForSelector(searchResultSelector);
 await page.click(searchResultSelector);

 // Locate the full title with a unique string 
 const textSelector = await page.waitForSelector(
   'text/Customize and automate',
 );
 const fullTitle = await textSelector?.evaluate(el => el.textContent);

 
/*  
await page.screenshot({
  path: 'puppeteer.png', 
  fullPage: true
}); 
*/
 
 // Print the full title
 console.log('The title of this blog post is "%s".', fullTitle);

 
var mailOptions = {
  from: 'from emailid',
  to: 'to emailid',
  subject: 'Sending Email using Puppeteer',
  text: fullTitle
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

 await browser.close();

})();


