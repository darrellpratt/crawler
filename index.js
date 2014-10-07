var cheerio = require('cheerio'),
    _ = require('underscore'),
    request = require('request')
chalk = require('chalk');



var baseUrl = 'http://www.cars.com';

console.log(urlList);

var urlList = new Array();
main(baseUrl, output);

function main(base, cb) {
	loadInitial('http://www.cars.com', inspectLink, cb);
	
};

function output() {
	var uniqueList = _.uniq(urlList);
	console.log(uniqueList);
}


function inspectLink(url) {
    // console.log(chalk.blue(url));
    // if (url.indexOf('//') == 0 || url.contains('http')) {
    if (!/^(f|ht)tps?:\/\//i.test(url) 
    		&& /^\/.*/.test(url) 
    		&& url.indexOf('//') < 0 
    		&& url !== '/'
    		&& !/video/.test(url)) {

        console.log(chalk.yellow('something found: ' + url));
        urlList.unshift(url);
    }
};


function loadInitial(url, cb, done) {
    console.log('fetching url: ' + url);
    request(url, function(err, res, body) {
        // console.log(body);
        var $ = cheerio.load(body);
        var len = $('#page').find('a').length;
        console.log(len);
        $('a').each(function(i, elem) {
            // console.log(i);
            var link = $(this).attr('href');
            cb(link);
        });
        done();
    });
}
