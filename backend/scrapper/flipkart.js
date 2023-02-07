import puppeteer from 'puppeteer';

const url = 'https://www.flipkart.com/';

export async function flipkartBrowserConfiguration(searchedProduct) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-fullscreen']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url, { waitUntil: 'load', timeout: 0 });


    // Searchbar
    await page.waitForSelector('body > div._2Sn47c > div > div > button');
    await page.click('body > div._2Sn47c > div > div > button');
    await page.type("#container > div > div._1kfTjk > div._1rH5Jn > div._2Xfa2_ > div._1cmsER > form > div > div > input", searchedProduct);
    await page.click("#container > div > div._1kfTjk > div._1rH5Jn > div._2Xfa2_ > div._1cmsER > form > div > button");

    // Product scrapping
    await page.waitFor(10000);
    let flipkartProducts = [];
    const searchedProducts = await page.$('#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div._2B099V > a.IRpwTa');
    const secSearchedProducts = await page.$('#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(2)');
    if (searchedProducts) {
        let scrapableProducts = 1;
        let i = 1;
        let productRow = 2;
        while (scrapableProducts <= 5) {
            if (i === 5) {
                i = 1;
                productRow = productRow + 1;
            }
            else {
                let scrappedProduct = {};
                scrappedProduct.reviews = [];
                const availableProduct = await page.$(`#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(${productRow}) > div > div:nth-child(${i}) > div > div._2B099V > a.IRpwTa`);
                scrappedProduct.productName = await page.evaluate((availableProduct) => availableProduct.textContent, availableProduct);
                let productURL = await page.evaluate(product => product.getAttribute('href'), availableProduct);
                scrappedProduct.productURL = `https://www.flipkart.com${productURL}`;

                // Product image
                const productImage = await page.$(`#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(${productRow}) > div > div:nth-child(${i}) > div > a > div:nth-child(1) > div > div > div > img`);
                scrappedProduct.imageURL = await page.evaluate(imgSrc => imgSrc.getAttribute('src'), productImage);

                // Product inner details
                await page.waitFor(3000);
                await page.click(`#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(${productRow}) > div > div:nth-child(${i}) > div > div._2B099V > a.IRpwTa`);
                await page.waitFor(10000);
                let pages = await browser.pages();

                const productPrice = await pages[2].$('#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div:nth-child(3) > div > div.dyC4hf.pZkvcx > div.CEmiEU > div > div._30jeq3._16Jk6d');
                if (productPrice) {
                    scrappedProduct.price = await pages[2].evaluate(innerPrice => innerPrice.textContent, productPrice);
                }
                const secproductPrice = await pages[2].$('#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div:nth-child(2) > div > div.dyC4hf.pZkvcx > div.CEmiEU > div > div._30jeq3._16Jk6d');
                if (secproductPrice) {
                    scrappedProduct.price = await pages[2].evaluate(innerPrice => innerPrice.textContent, secproductPrice);
                }

                const productRating = await pages[2].$('div.gUuXy-._16VRIQ._1eJXd3 > span > div');
                if (productRating) {
                    scrappedProduct.rating = await pages[2].evaluate(element => element.textContent, productRating);
                }
                else {
                    scrappedProduct.rating = 0;
                }

                const reviews = await pages[2].$('#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div._1YokD2._3Mn1Gg > div:nth-child(4) > div > div._2c2kV-._33R3aa > div:nth-child(1) > div > div > div:nth-child(1) > div > div');
                if (reviews) {
                    let availableReview = true;
                    let j = 1;
                    while (availableReview) {
                        let nextReview = await pages[2].$(`#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div._1YokD2._3Mn1Gg > div:nth-child(4) > div > div._2c2kV-._33R3aa > div:nth-child(${j}) > div > div > div:nth-child(1) > div > div > div._6K-7Co`);
                        if (nextReview) {
                            const userReview = await pages[2].evaluate(review => review.textContent, nextReview);
                            let topProd = 0;
                            if (userReview.includes('good') || userReview.includes('nice') || userReview.includes('amazing') || userReview.includes('awesome') || userReview.includes('great') || userReview.includes('perfect')) {
                                topProd += 1;
                            }
                            scrappedProduct.reviews.push(userReview);
                            j++;
                        }
                        else {
                            availableReview = false;
                        }
                    }
                }

                scrappedProduct.tag = 'flipkart';
                flipkartProducts.push(scrappedProduct);
                await pages[2].close();

                scrapableProducts++;
                i++;
            }
        }
        await browser.close();
        return flipkartProducts;
    }
    else if (secSearchedProducts) {
        let scrapableProducts = 1;
        let i = 2;
        while (scrapableProducts <= 5) {
            let scrappedProduct = {};
            scrappedProduct.reviews = [];
            const availableProduct = await page.$(`#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(${i}) > div > div > div > a > div._3pLy-c.row > div.col.col-7-12 > div._4rR01T`);
            scrappedProduct.productName = await page.evaluate((availableProduct) => availableProduct.textContent, availableProduct);

            const availableProductUrl = await page.$(`#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(${i}) > div > div > div > a`);
            let productURL = await page.evaluate(product => product.getAttribute('href'), availableProductUrl);
            scrappedProduct.productURL = `https://www.flipkart.com${productURL}`;

            // Product image
            const productImage = await page.$(`#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(${i}) > div > div > div > a > div.MIXNux > div._2QcLo- > div > div > img`);
            scrappedProduct.imageURL = await page.evaluate(imgSrc => imgSrc.getAttribute('src'), productImage);

            // Product inner details
            await page.waitFor(3000);
            await page.click(`#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div:nth-child(2) > div:nth-child(${i}) > div > div > div > a`);
            await page.waitFor(10000);
            let pages = await browser.pages();

            const productPrice = await pages[2].$('#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div:nth-child(2) > div > div.dyC4hf > div.CEmiEU > div > div._30jeq3._16Jk6d');
            if (productPrice) {
                scrappedProduct.price = await pages[2].evaluate(innerPrice => innerPrice.textContent, productPrice);
            }
            const secproductPrice = await pages[2].$('#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div:nth-child(2) > div > div.dyC4hf.pZkvcx > div.CEmiEU > div > div._30jeq3._16Jk6d');
            if (secproductPrice) {
                scrappedProduct.price = await pages[2].evaluate(innerPrice => innerPrice.textContent, secproductPrice);
            }

            const productRating = await pages[2].$('div.gUuXy-._16VRIQ > span > div');
            if (productRating) {
                scrappedProduct.rating = await pages[2].evaluate(element => element.textContent, productRating);
            }
            else {
                scrappedProduct.rating = 0;
            }

            const reviews = await pages[2].$('div._2c2kV- > div._16PBlm:nth-child(1) > div > div.col._2wzgFH > div > p');
            if (reviews) {
                let availableReview = true;
                let j = 1;
                while (availableReview) {
                    let nextReview = await pages[2].$(`div._2c2kV- > div._16PBlm:nth-child(${j}) > div > div.col._2wzgFH > div > p`);
                    if (nextReview) {
                        const userReview = await pages[2].evaluate(review => review.textContent, nextReview);
                        let topProd = 0;
                        if (userReview.includes('good') || userReview.includes('nice') || userReview.includes('amazing') || userReview.includes('awesome') || userReview.includes('great') || userReview.includes('perfect')) {
                            topProd += 1;
                        }
                        scrappedProduct.reviews.push(userReview);
                        j++;
                    }
                    else {
                        availableReview = false;
                    }
                }
            }

            scrappedProduct.tag = 'flipkart';
            flipkartProducts.push(scrappedProduct);
            await pages[2].close();

            scrapableProducts++;
            i++;
        }
        await browser.close();
        return flipkartProducts;
    }
    else {
        await browser.close();
        return flipkartProducts;
    }
};