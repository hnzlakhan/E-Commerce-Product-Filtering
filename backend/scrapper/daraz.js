import puppeteer from 'puppeteer';

const url = 'https://www.daraz.pk/';

export async function darazBrowserConfiguration(searchedProduct) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-fullscreen']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    // Searchbar
    await page.type("#q", searchedProduct);
    await page.click("#topActionHeader > div > div.lzd-logo-bar > div > div.lzd-nav-search > form > div > div.search-box__search--2fC5 > button");

    // Product scrapping
    await page.waitFor(5000);
    let darazProducts = [];
    const searchedProducts = await page.$('#root > div > div.ant-row.main--pIV2h > div > div > div.ant-col-20.ant-col-push-4.side-right--Tyehf > div.box--ujueT > div:nth-child(1) > div > div > div.info--ifj7U > div.title--wFj93 > a');
    if (searchedProducts) {
        let scrapableProducts = 1;
        let i = 1;
        while (scrapableProducts <= 5) {
            let scrappedProduct = {};
            scrappedProduct.reviews = [];
            const ratedProducts = await page.$(`#root > div > div.ant-row.main--pIV2h > div > div > div.ant-col-20.ant-col-push-4.side-right--Tyehf > div.box--ujueT > div:nth-child(${i}) > div > div > div.info--ifj7U > div.rateAndLoc--XWchq > div > span`);
            if (ratedProducts) {
                const availableProduct = await page.$(`#root > div > div.ant-row.main--pIV2h > div > div > div.ant-col-20.ant-col-push-4.side-right--Tyehf > div.box--ujueT > div:nth-child(${i}) > div > div > div.info--ifj7U > div.title--wFj93 > a`);
                scrappedProduct.productName = await page.evaluate((availableProduct) => availableProduct.textContent, availableProduct);
                let productURL = await page.evaluate(product => product.getAttribute('href'), availableProduct);
                scrappedProduct.productURL = productURL.substring(2);

                // Product inner detaivls
                await page.waitFor(5000);
                await page.click(`#root > div > div.ant-row.main--pIV2h > div > div > div.ant-col-20.ant-col-push-4.side-right--Tyehf > div.box--ujueT > div:nth-child(${i}) > div > div > div.info--ifj7U > div.title--wFj93 > a`);
                await page.waitFor(10000);

                const productImage = await page.$('#module_item_gallery_1 > div > div.gallery-preview-panel > div > img');
                scrappedProduct.imageURL = await page.evaluate(imgSrc => imgSrc.getAttribute('src'), productImage);

                const productPrice = await page.$('#module_product_price_1 > div > div > span');
                scrappedProduct.price = await page.evaluate(innerPrice => innerPrice.textContent, productPrice);

                await page.waitFor(5000);
                const scroller = await page.$('#module_add_to_cart > div > button.add-to-cart-buy-now-btn.pdp-button.pdp-button_type_text.pdp-button_theme_bluedaraz.pdp-button_size_xl > span > span');
                if (scroller) {
                    await page.evaluate((element) => {
                        element.scrollIntoView();
                    }, scroller);
                }
                await page.waitFor(2000);
                const viewMore = await page.$('#module_product_detail > div > div > div.expand-button.expand-cursor > button');
                if (viewMore) {
                    await page.evaluate((element) => {
                        element.scrollIntoView();
                    }, viewMore);
                }
                await page.waitFor(4000);
                const productRating = await page.$('#module_product_review > div > div > div:nth-child(1) > div.mod-rating > div > div > div.summary > div.score > span.score-average');
                if (productRating) {
                    await page.evaluate((element) => {
                        element.scrollIntoView();
                    }, productRating);
                }
                scrappedProduct.rating = await page.evaluate(rating => rating.textContent, productRating);

                const reviews = await page.$('#module_product_review > div > div > div:nth-child(3) > div');
                if (reviews) {
                    await page.evaluate((element) => {
                        element.scrollIntoView();
                    }, reviews);
                }
                if (reviews) {
                    let availableReview = true;
                    let j = 1;
                    while (availableReview) {
                        let nextReview = await page.$(`#module_product_review > div > div > div:nth-child(3) > div > div:nth-child(${j}) > div.item-content > div.content`);
                        if (nextReview) {
                            const userReview = await page.evaluate(review => review.textContent, nextReview);
                            let topProd = 0;
                            if (userReview.includes('good') || userReview.includes('nice') || userReview.includes('amazing') || userReview.includes('awesome') || userReview.includes('great') || userReview.includes('perfect')) {
                                topProd += 1;
                            }
                            scrappedProduct.reviews.push(userReview.trim());
                            j++;
                        }
                        else {
                            availableReview = false;
                        }
                    }
                }

                scrappedProduct.tag = 'daraz';
                darazProducts.push(scrappedProduct);

                await page.goBack({ waitUntil: 'load', timeout: 0 });
                await page.waitFor(6000);
                scrapableProducts++;
            }
            i++;
        }

        await browser.close();

        return darazProducts;
    }
    else {
        await browser.close();
        return darazProducts;
    }
};