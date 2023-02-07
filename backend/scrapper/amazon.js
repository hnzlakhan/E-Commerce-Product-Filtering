import puppeteer from 'puppeteer';

const url = 'https://www.amazon.com/';

export async function amazonBrowserConfiguration(searchedProduct) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-fullscreen']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    await page.waitFor(2000);
    const captcha = await page.$('body > div > div.a-row.a-spacing-double-large > div.a-section > div > div > form > div.a-row.a-spacing-large > div > div > div.a-row.a-spacing-base > div > div.a-column.a-span6.a-span-last.a-text-right > a');
    if (captcha) {
        await page.click('body > div > div.a-row.a-spacing-double-large > div.a-section > div > div > form > div.a-row.a-spacing-large > div > div > div.a-row.a-spacing-base > div > div.a-column.a-span6.a-span-last.a-text-right > a');
    }

    // Searchbar
    await page.waitFor(10000);
    await page.type("#twotabsearchtextbox", searchedProduct);
    await page.click("#nav-search-submit-button");

    // Product scrapping
    await page.waitFor(6000);
    let amazonProducts = [];
    const searchedProducts = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(8)');
    if (searchedProducts) {
        let scrapableProducts = 1;
        let i = 8;
        while (scrapableProducts <= 5) {
            let scrappedProduct = {};
            scrappedProduct.reviews = [];
            const availableProduct = await page.$(`#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(${i}) > div > div > div > div > div.a-section.a-spacing-small.s-padding-left-small.s-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a > span`);
            const secAvailableProduct = await page.$(`#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(${i}) > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.a-section.a-spacing-none.s-padding-right-small.s-title-instructions-style > h2 > a > span`);
            if (availableProduct) {
                scrappedProduct.productName = await page.evaluate((availableProduct) => availableProduct.textContent, availableProduct);

                const availableProductURL = await page.$(`#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(${i}) > div > div > div > div > div.a-section.a-spacing-small.s-padding-left-small.s-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a`);
                const outputUrl = await page.evaluate(prodUrl => prodUrl.getAttribute('href'), availableProductURL);
                scrappedProduct.productURL = `https://www.amazon.com${outputUrl}`;

                await page.click(`#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(${i}) > div > div > div > div > div.a-section.a-spacing-small.s-padding-left-small.s-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a`);
                await page.waitFor(6000);
                const productURL = await page.$('#landingImage');
                scrappedProduct.imageURL = await page.evaluate(prodImg => prodImg.getAttribute('src'), productURL);

                const productPrice = await page.$('#corePrice_desktop > div > table > tbody > tr > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)');
                if (productPrice) {
                    scrappedProduct.price = await page.evaluate(innerPrice => innerPrice.textContent, productPrice);
                }
                const secProductPrice = await page.$('#corePrice_desktop > div > table > tbody > tr > td.a-span12 > span.a-price-range > span:nth-child(1) > span:nth-child(2)');
                if (secProductPrice) {
                    scrappedProduct.price = await page.evaluate(innerPrice => innerPrice.textContent, secProductPrice);
                }
                if (!productPrice && !secProductPrice) {
                    scrappedProduct.price = 0;
                }

                const productRating = await page.$('#reviewsMedley > div > div.a-fixed-left-grid-col.a-col-left > div.a-section.a-spacing-none.a-spacing-top-mini.cr-widget-ACR > div.a-fixed-left-grid.AverageCustomerReviews.a-spacing-small > div > div.a-fixed-left-grid-col.aok-align-center.a-col-right > div > span > span');
                const outputRating = await page.evaluate(prodRating => prodRating.textContent, productRating);
                const finalRating = outputRating.split(' ');
                scrappedProduct.rating = finalRating[0];

                const reviews = await page.$('#cm-cr-dp-review-list > div:nth-child(1)');
                if (reviews) {
                    let availableReview = true;
                    let j = 1;
                    while (availableReview) {
                        let nextReview = await page.$(`#cm-cr-dp-review-list > div:nth-child(${j}) > div > div > div.a-row.a-spacing-small.review-data`);
                        if (nextReview) {
                            const userReview = await page.evaluate(review => review.textContent, nextReview);
                            const rawReviews = userReview.split('\n');
                            rawReviews.forEach(element => {
                                if (element === '' || element === 'Read more' || element === '  ') {
                                    return;
                                }
                                else {
                                    let topProd = 0;
                                    if (element.includes('good') || element.includes('nice') || element.includes('amazing') || element.includes('awesome') || element.includes('great') || element.includes('perfect')) {
                                        topProd += 1;
                                    }
                                    scrappedProduct.reviews.push(element.trim());
                                }
                            });
                            j++;
                        }
                        else {
                            availableReview = false;
                        }
                    }
                }

                scrapableProducts++;

                scrappedProduct.tag = 'amazon';
                amazonProducts.push(scrappedProduct);

                await page.goBack({ waitUntil: 'load', timeout: 0 });
                await page.waitFor(6000);
            }
            else if (secAvailableProduct) {
                scrappedProduct.productName = await page.evaluate((availableProduct) => availableProduct.textContent, secAvailableProduct);

                const availableProductURL = await page.$(`#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(${i}) > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.a-section.a-spacing-none.s-padding-right-small.s-title-instructions-style > h2 > a`);
                const outputUrl = await page.evaluate(prodUrl => prodUrl.getAttribute('href'), availableProductURL);
                scrappedProduct.productURL = `https://www.amazon.com${outputUrl}`;

                await page.click(`#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(${i}) > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.a-section.a-spacing-none.s-padding-right-small.s-title-instructions-style > h2 > a`);
                await page.waitFor(6000);

                const productURL = await page.$('#landingImage');
                scrappedProduct.imageURL = await page.evaluate(prodImg => prodImg.getAttribute('src'), productURL);

                const productPrice = await page.$('#corePrice_desktop > div > table > tbody > tr > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)');
                if (productPrice) {
                    scrappedProduct.price = await page.evaluate(innerPrice => innerPrice.textContent, productPrice);
                }
                const secProductPrice = await page.$('#corePrice_desktop > div > table > tbody > tr > td.a-span12 > span.a-price-range > span:nth-child(1) > span:nth-child(2)');
                if (secProductPrice) {
                    scrappedProduct.price = await page.evaluate(innerPrice => innerPrice.textContent, secProductPrice);
                }
                if (!productPrice && !secProductPrice) {
                    scrappedProduct.price = 0;
                }

                const productRating = await page.$('#reviewsMedley > div > div.a-fixed-left-grid-col.a-col-left > div.a-section.a-spacing-none.a-spacing-top-mini.cr-widget-ACR > div.a-fixed-left-grid.AverageCustomerReviews.a-spacing-small > div > div.a-fixed-left-grid-col.aok-align-center.a-col-right > div > span > span');
                const outputRating = await page.evaluate(prodRating => prodRating.textContent, productRating);
                const finalRating = outputRating.split(' ');
                scrappedProduct.rating = finalRating[0];

                const reviews = await page.$('#cm-cr-dp-review-list > div:nth-child(1)');
                if (reviews) {
                    let availableReview = true;
                    let j = 1;
                    while (availableReview) {
                        let nextReview = await page.$(`#cm-cr-dp-review-list > div:nth-child(${j}) > div > div > div.a-row.a-spacing-small.review-data`);
                        if (nextReview) {
                            const userReview = await page.evaluate(review => review.textContent, nextReview);
                            const rawReviews = userReview.split('\n');
                            rawReviews.forEach(element => {
                                if (element === '' || element === 'Read more' || element === '  ') {
                                    return;
                                }
                                else {
                                    let topProd = 0;
                                    if (element.includes('good') || element.includes('nice') || element.includes('amazing') || element.includes('awesome') || element.includes('great') || element.includes('perfect')) {
                                        topProd += 1;
                                    }
                                    scrappedProduct.reviews.push(element.trim());
                                }
                            });
                            j++;
                        }
                        else {
                            availableReview = false;
                        }
                    }
                }

                scrapableProducts++;

                scrappedProduct.tag = 'amazon';
                amazonProducts.push(scrappedProduct);

                await page.goBack({ waitUntil: 'load', timeout: 0 });
                await page.waitFor(6000);
            }
            i++;
        }
        await browser.close();
        return amazonProducts;
    }
    else {
        await browser.close();
        return amazonProducts;
    }
};