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
	},'アジャイル');
});

casper.then(function() {
	this.wait(1000, function(){
		this.echo('Loading...');
	});
});

casper.then(function() {
	var tdList = this.evaluate(function(){
		return document.querySelectorAll('html body table:nth-of-type(6) tbody tr td');
	});
	for (var i = 0; i < tdList.length; i++){
			this.echo(i);
		if (tdList[i]) {
			 this.echo('値は' + tdList[i].innerHTML);
		};
	};
});

var capFileName = 'google.png';
casper.then(function() {
	this.capture(capFileName);
});

casper.run();
