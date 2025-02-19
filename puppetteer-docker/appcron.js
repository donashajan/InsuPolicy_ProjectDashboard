import puppeteer from 'puppeteer';
import XLSX from 'xlsx';


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


 const workSheet = XLSX.utils.json_to_sheet(books);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
    XLSX.writeFile(workBook, "./result/sample.xlsx");

 await browser.close();
})();
