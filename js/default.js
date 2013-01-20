// backbone config
Backbone.setDomLibrary($); 

// viewporter config
//viewporter.preventPageScroll = false;
//
// desktop party
$(document).ready(function() {
    app.initialize();
});

// handy functions
function nl2br (str) {
    return (str ? (str + '').replace(/\n/g,'<br />') : '');
}
function br2nl (str) {
    return (str ? (str + '').replace(/\<br \/\>/g,"\n") : '');
}

function stringTruncate(str, length, end) {
    if (!length) length = 50;
    if (!end) end = '...';
    return str.length > length ? $.trim(str.substr(0, length - end.length))+end : str;
}

function getHash(length) {
	var key = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLM12345NOPQRSTUVWXYZ67890";
	var string = '';
	for (var i=0; i < length; i++) {
		string += key[rand(0, key.length -1)];
	}
	return string;
}

function rand(min,max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}