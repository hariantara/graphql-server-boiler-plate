const { Builder, By, Key, until } = require('selenium-webdriver');
var request = require('request');
var cheerio = require('cheerio');


const execScript = ({ driver, selector }) => {
    return new Promise((resolve, reject) => {
        driver.executeScript(`return document.querySelector("${selector}").innerHTML;`).then((innerHTML) => {
            resolve(innerHTML);
        }).catch((err) => {
            reject(err);
        });
    });
};


const scrapping = async(data) => {
    console.log('data scrapping: ', data)
    let driver = await new Builder().forBrowser('chrome').build();
    try{
        let xPathData = `//div[@id="flight-listing-container"]`
        await driver.get(data);
        let loadingPage = await driver.wait(until.elementLocated(By.xpath(xPathData)))
        if(loadingPage){
            let gettingHMTL = await execScript({ driver, selector: '#flight-listing-container'})
            // console.log('gettingHMTL: ', gettingHMTL)
            if (gettingHMTL){
                let $ = cheerio.load(gettingHMTL);
                let listFlight = []
                $('ul#flightModuleList li').each(function (i, el){
                    let airlineName = $(el).find(`[data-test-id="airline-name"]`).text()
                    // console.log('airlineName: ', airlineName)
                    let obj = {
                        airlineName: $(el).find(`[data-test-id="airline-name"]`).text().trim(),
                        airlineImage: `https:`+ $(`.tile-media`).attr('src'),
                        airlineDetail: $(this).find(`[data-test-id="flight-info"]`).text().toString().replace(/\r?\n|\r/g, '').trim(),
                        flightType: $(el).find(`[data-test-id="price-msg-route-type"]`).text().trim(),
                        departureTime: $(el).find(`[data-test-id="departure-time"]`).text().trim(),
                        arrivalTime: $(el).find(`[data-test-id="arrival-time"]`).text().trim(),
                        flightDuration: $(el).find(`[data-test-id="duration"]`).text().trim(),
                        price: $(el).find(`[data-test-id="listing-price-dollars"]`).text().trim()
                    }
                    listFlight.push(obj)
                    // let getNewData = data.attr('data-test-idass')
                    // console.log('getNewData: ', getNewData)
                })
                console.log('listFlight: ', listFlight)
            }
        }
    }catch(err){
        console.log('err: ', err)
    }
    finally {
        await driver.quit();
    }
}

module.exports = {
    scrapping
}