casper = require('casper').create({
	verbose: true,
	logLevel: 'debug',
	pageSettings: {
		webSecurityEnabled: false
	}
});
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36 ');

var url = 'http://www.kawaguchi-lib.jp/opw1/OPW/OPWSRCH1.CSP';

casper.start(url, function() {
	this.evaluate(function(searchWord) {
		document.getElementById('text1').value = searchWord;
		document.getElementsByName('InForm')[0].submit();
	},'プロジェクトマネジメント');
});

var loopCount = 0;
var enableNextPage = true;

//while(enableNextPage) {

	casper.then(function() {
		this.wait(1000, function(){
			//this.echo('Loading...');
		});
	});

	casper.then(function() {
		var tdItem = this.evaluate(function(){
			var tdList = document.querySelectorAll('html body table:nth-of-type(6) tbody tr td');
			return Array.prototype.map.call(tdList, function(e) {
				return e.innerText;
			});
		});

		var bookList = '';
		var lastField = 0;
		for (var i = 0; i < tdItem.length; i++) {
			lastField = i % 6;
			if (lastField == 5) {
				bookList = bookList + tdItem[i];
				this.echo(bookList);
				bookList = '';
			} else {
				bookList = bookList + tdItem[i] + ','
			}
		}

		var nextPageLink = this.evaluate(function() {
			//return document.querySelector('html body table:nth-of-type(5) tbody tr td table tbody tr td nobr a');
			var nextPageElements = document.querySelectorAll('html body table:nth-of-type(5) tbody tr td table tbody tr td:nth-of-type(6) nobr a');
			return Array.prototype.map.call(nextPageElements, function(f) {
				return f;
			});
		});
		if(nextPageLink) {
			this.click('html body table:nth-of-type(5) tbody tr td table tbody tr td:nth-of-type(6) nobr a');
			enableNextPage = true;
		} else {
			enableNextPage = false;
		}
	});

	casper.then(function() {
		this.capture('kawaguchilib_' + loopCount + '.png');
	});

	loopCount = loopCount++;
//}

casper.run();
