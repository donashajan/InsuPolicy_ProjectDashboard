import puppeteer from 'puppeteer';
import fs from 'fs';
import getDiff from 'json-difference';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
  const page = await browser.newPage();

 
 // Navigate the page to a URL
 await page.goto('http://books.toscrape.com/');


 let books = []
    const products = await page.$$('.product_pod')
 
        for(const product of products){
                const title = await page.evaluate(el => el.querySelector("h3 > a").innerText, product)
                const link = await page.evaluate(el => el.querySelector(".image_container a").href, product)
                const price = await page.evaluate(el => el.querySelector(".product_price p.price_color").innerText, product)
                const image = await page.evaluate(el => el.querySelector(".image_container a img").getAttribute('src'), product)
               //const availability = await page.evaluate(el => el.querySelector(".product_price p.instock availability").innerText, product)
                books.push({
                    title,link, price, image
                })
            
        }
       
        console.log(books);

        const jsonData = JSON.stringify(books);

        //path to save json file
        const filePath = '/result/books.json';

        // Check if the file exists
    let fileExists = fs.existsSync(filePath);   
    // If the file does not exist
if (!fileExists) {
  
  fs.writeFileSync(filePath, jsonData);
}
        

  fs.readFile("/result/books.json", function(err, data) { 
    
  // Check for errors 
  if (err) throw err; 

  // Converting to JSON 
  const readBooks = JSON.parse(data); 
  const jsonReadData = JSON.stringify(books);
  const diff = getDiff(jsonData,  jsonReadData);
  console.log('diff', JSON.stringify(diff));
  if(JSON.stringify(diff).length ==0 || '{}') {

    console.log("no updates");
  }
  else{
    try {
      fs.writeFileSync(filePath, jsonData);
      console.log('JSON data saved to file successfully.');
    } catch (error) {
      console.error('Error writing JSON data to file:', error);
    }
  }
  
});
       

 await browser.close();

})();


