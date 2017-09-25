/*
* Copyright (c) 2006-2007 Rudi Bravo
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked, and must not be
* misrepresented the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/


var canvas = document.getElementById('main');
var ctx = canvas.getContext('2d');

/* utility to add a script node to the current document
   and call the callback function when it is loaded.
   Should allow scripts to be loaded at any time during document
   life..and have code be kicked off after they are loaded.

   Browsers tested:
   FF 3.6.x     - WORKS
   Chrome 5.x   - WORKS
   Safari 4.x   - WORKS
   MS IE 8      - WORKS
   Opera 10.x   - WORKS
http://software.intel.com/en-us/blogs/2010/05/22/dynamically-load-javascript-with-load-completion-notification/
*/
function $import(scriptURL, onloadCB) {
	var scriptEl    = document.createElement("script");
	scriptEl.type   = "text/javascript";
	scriptEl.src    = scriptURL;

	function calltheCBcmn() {
		onloadCB(scriptURL);
	}

	if(typeof(scriptEl.addEventListener) != 'undefined') {
		/* The FF, Chrome, Safari, Opera way */
		scriptEl.addEventListener('load',calltheCBcmn,false);
	}
	else {
		/* The MS IE 8+ way (may work with others - I dunno)*/
		function handleIeState() {
			if(scriptEl.readyState == 'loaded'){
				calltheCBcmn(scriptURL);
			}
		}
		var ret = scriptEl.attachEvent('onreadystatechange',handleIeState);
	}
	document.getElementsByTagName("head")[0].appendChild(scriptEl);
};

function getUrlVars()
{
    var vars = [], hash;
    var sURL = window.document.URL.toString();
    var hashes = sURL.slice(sURL.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

/*
 * http://stackoverflow.com/questions/237104/javascript-array-containsobj/237176#237176
 */
function contains(a, obj) {
	var i = a.length;
	while (i--)
	    if (a[i] === obj)
	    	return true;
	return false;
}

function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

Sign = function(_n) {
	if (_n < 0) {return -1};
	if (_n > 0) {return 1};
	return 0;
}