var cheerio = require('cheerio'),
    _ = require('underscore'),
    request = require('request'),
    when = require('when'),
    chalk = require('chalk');



var baseUrl = 'http://www.cars.com';
var urlList = new Array();

// start at base
main(baseUrl, output);

function main(base, cb) {
    console.log(chalk.red('starting'));
    loadInitial('http://www.cars.com', inspectLink, clean, cb);
};

function clean(cb) {
    var uniqueList = _.uniq(urlList);
    // cb(uniqueList);
    _.each(uniqueList, function(element) {
        console.log(chalk.white(element));
        loadInitial(baseUrl + element, inspectLink, clean, output);
    })
};

function recurseList(url) {
    console.log(baseUrl + url);
    loadInitial(baseUrl + url, inspectLink, clean, output);
};

function output(list) {
    console.log(list);
};


function inspectLink(url) {
    // console.log(chalk.blue(url));
    if (!/^(f|ht)tps?:\/\//i.test(url) && /^\/.*/.test(url) && url.indexOf('//') < 0 && url !== '/' && !/video/.test(url)) {
        urlList.unshift(url);
        // console.log(chalk.blue(url));
    }
};

function loadInitial(url, cb, done, fn) {
    console.log(chalk.blue('fetching url: ' + url));
    request(url, function(err, res, body) {
        // console.log(body);
        var $ = cheerio.load(body);
        var len = $('#page').find('a').length;
        if (len > 0) {
            // console.log(len);
            $('a').each(function(i, elem) {
                var link = $(this).attr('href');
                cb(link);
            });
        }
        done(fn);
    });
};
