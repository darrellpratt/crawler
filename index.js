var cheerio = require('cheerio'),
    _ = require('underscore'),
    request = require('request'),
    when = require('when'),
    chalk = require('chalk'),
    fs = require('fs');



var baseUrl = 'http://www.cars.com';
var urlList = new Array();
var masterUrlList = new Array();
var pageCount = 0;
var log = fs.createWriteStream('log.txt', {'flags': 'a'});

// start at base
main(baseUrl, output);

function main(base, cb) {
    
    console.log(chalk.red('starting'));
    loadInitial('http://www.cars.com', inspectLink, clean, cb);
};

function clean(cb) {
    console.log(chalk.red('cleaning'));
    var uniqueList = _.uniq(masterUrlList);
    console.log(uniqueList);
    // cb(uniqueList);
    _.each(uniqueList, function(element) {
        // console.log(chalk.white(element));
        loadInitial(baseUrl + element, inspectLink, clean, output);
    });
    masterUrlList = new Array();
    console.log(urlList.length);
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
    return hashFnv32a(s, true);
};

function hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false */
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if( asString ){
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
};

function isUrlGood(url) {
    var isGood = false;
        if (!/^(f|ht)tps?:\/\//i.test(url) 
        && /^\/.*/.test(url) 
        && url.indexOf('//') < 0 
        && url !== '/' 
        && !/video/.test(url)
        && !/for-sale/.test(url)
        && !/vehicledetail/.test(url)) {
        
        isGood = true;
    };
    
    return isGood;
};


function inspectLink(url) {
    // console.log(chalk.red('inspectLink'));
    // console.log(chalk.blue(url));
    if (isUrlGood(url)) {
        // should check here for uniqueness
        if (_.indexOf(urlList, hashCode(url)) == -1) {
            console.log(chalk.yellow('legitimate url: ' + url));
            log.write(url + '\n');
            urlList.unshift(hashCode(url));
            masterUrlList.unshift(url);
            console.log(chalk.green(urlList.length));
            // console.log(chalk.blue(url));
        }
    }
};

function loadInitial(url, cb, done, fn) {
    console.log(chalk.red('loadInitial'));
    console.log(chalk.blue(++pageCount + ' fetching url: ' + url));
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
