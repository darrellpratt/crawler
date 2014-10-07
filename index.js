var cheerio = require('cheerio'),
    _ = require('underscore'),
    request = require('request'),
    when = require('when'),
    chalk = require('chalk');



var baseUrl = 'http://www.cars.com';
var urlList = new Array();
var masterUrlList = new Array();
var pageCount = 0;

// start at base
main(baseUrl, output);

function main(base, cb) {
    console.log(chalk.red('starting'));
    loadInitial('http://www.cars.com', inspectLink, clean, cb);
};

function clean(cb) {
    console.log(chalk.red('cleaning'));
    var uniqueList = _.uniq(urlList);
    console.log(uniqueList);
    // cb(uniqueList);
    _.each(uniqueList, function(element) {
        // console.log(chalk.white(element));
        loadInitial(baseUrl + element, inspectLink, clean, output);
    })
};

function recurseList(url) {
    console.log(chalk.red('recursing'));
    // console.log(baseUrl + url);
    if (_.indexOf(urlList, hashCode(url)) == -1) {
        loadInitial(baseUrl + url, inspectLink, clean, output);
    }
};

function output(list) {
    console.log(list);
};

function hashCode(s) {
    // return s.split("").reduce(function(a, b) {
    //     a = ((a << 5) - a) + b.charCodeAt(0);
    //     return a & a
    // }, 0);
    var hash = 0,
        i, chr, len;
    if (s == 0) return hash;
    for (i = 0, len = s.length; i < len; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


function inspectLink(url) {
    // console.log(chalk.red('inspectLink'));
    // console.log(chalk.blue(url));
    if (!/^(f|ht)tps?:\/\//i.test(url) && /^\/.*/.test(url) && url.indexOf('//') < 0 && url !== '/' && !/video/.test(url)) {
        // should check here for uniqueness
        if (_.indexOf(urlList, hashCode(url)) == -1) {
            console.log(chalk.yellow('legitimate url: ' + url))
            urlList.unshift(hashCode(url));
            console.log(chalk.green(urlList.length));
            // console.log(chalk.blue(url));
        }
    }
};

function loadInitial(url, cb, done, fn) {
    // console.log(chalk.red('loadInitial'));
    // console.log(chalk.blue(++pageCount + ' fetching url: ' + url));
    request(url, function(err, res, body) {
        // console.log(body);
        if (!err) {
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
        }
    });
};
