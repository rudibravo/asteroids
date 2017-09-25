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
	// do nothing
}

var Keyboard = {
	keys : {
		32: function(){if (!Game.gameover) { return true } if (Date.now() > Keyboard.play) { Keyboard.play = Date.now() + 2000; return true } return false;}, 
		38: function(){if (Date.now() > Keyboard.changeSpeed) { Keyboard.speed = Math.random(); Keyboard.changeSpeed = Date.now() + 200 } return Keyboard.speed > 0.7},
		37: function(){if (Date.now() > Keyboard.changeDirections) { Keyboard.left = Math.random(); Keyboard.changeDirections = Date.now() + 200 } return Keyboard.direction > 0.7}, 
		39: function(){return Keyboard.speed < 0.3}, 
		40: function(){return Keyboard.direction < 0.3}
		},
	isKeyDown : function (_k) {
		if (_k in this.keys)
			return this.keys[_k]();
		return false;
	},
	direction: 0.5,
	speed: 1,
	changeDirections: Date.now() + 200,
	changeSpeed: Date.now() + 200,
	play: Date.now() + 2000
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