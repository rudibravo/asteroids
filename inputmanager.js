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


var InputManager = function() {
	this.registerListers();
	this.screenMousePoint = new Vec2();
	this.lastWidget = 0;
}

InputManager.prototype.registerListers = function() {
	window.addEventListener('keydown', bind(this, this.onkeydown), true);
	window.addEventListener('keyup', bind(this, this.onkeyup), true);

	canvas.addEventListener('mouseup', bind(this, this.onmouseup), false);
	canvas.addEventListener('mousedown', bind(this, this.onmousedown), false);
	canvas.addEventListener('mouseout', bind(this, this.onmouseout), false);
	canvas.addEventListener('mousemove', bind(this, this.onmousemove), false);
	canvas.addEventListener('dblclick', bind(this, this.ondblclick), false);

	//TODO: maybe touch events?
}

InputManager.prototype.getCanvasCoord = function(e) {
    var posx = 0;
    var posy = 0;
    if (!e) e = window.event;

    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    this.screenMousePoint.set(posx, posy);
};

InputManager.prototype.onkeydown = function(e) {
	Keyboard.keys[e.keyCode] = true;
};

InputManager.prototype.onkeyup = function(e) {
	Keyboard.keys[e.keyCode] = false;
};

InputManager.prototype.onmouseup = function(e) {
	e.preventDefault();
};

InputManager.prototype.onmousedown = function(e) {
	e.preventDefault();
};

InputManager.prototype.onmouseout = function(e) {
	e.preventDefault();
};

InputManager.prototype.onmousemove = function(e) {
	e.preventDefault();
	this.getCanvasCoord(e);
};

InputManager.prototype.ondblclick = function(e) {
	e.preventDefault();
};

var Keyboard = {
	keys : {},
	isKeyDown : function (_k) {
		if (_k in this.keys)
			return this.keys[_k];
		return false;
	}
};

var KEYS = {
	SPACE : '32',
	UP : '38',
	DOWN : '40',
	LEFT: '37',
	RIGHT: '39',
	0: '48',
	1: '49',
	2: '50',
	3: '51',
	4: '52',
	5: '53',
	6: '54',
	7: '55',
	8: '56',
	9: '57',
	A: '65',
	B: '66',
	C: '67',
	D: '68',
	E: '69',
	F: '70',
	G: '71',
	H: '72',
	I: '73',
	J: '74',
	K: '75',
	L: '76',
	M: '77',
	N: '78',
	O: '79',
	P: '80',
	Q: '81',
	R: '82',
	S: '83',
	T: '84',
	U: '85',
	V: '86',
	W: '87',
	X: '88',
	Y: '89',
	Z: '90'
};