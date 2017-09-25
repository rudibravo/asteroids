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


/**
 * Vec2 class 
 */

Vec2 = function(_x, _y) {
	this.x = _x;
	this.y = _y;
};

Vec2.ZERO = new Vec2(0,0);
Vec2.ONE = new Vec2(1,1);

Vec2.prototype.clone = function() {
	return new Vec2(this.x, this.y);
};

Vec2.prototype.set = function(_x, _y) {
	this.x = _x;
	this.y = _y;
}

Vec2.prototype.add = function (_b) {
	var r = new Vec2(this.x, this.y);
	r.x += _b.x;
	r.y += _b.y;
	return r;
};

Vec2.prototype.subtract = function (_b) {
	var r = new Vec2(this.x, this.y);
	r.x -= _b.x;
	r.y -= _b.y;
	return r;
};

Vec2.prototype.mulScalar = function (_c) {
	var r = new Vec2(this.x, this.y);
	r.x *= _c;
	r.y *= _c;
	return r;
};

Vec2.prototype.divisionScalar = function (_c) {
	var r = new Vec2(this.x, this.y);
	r.x /= _c;
	r.y /= _c;
	return r;
};

Vec2.prototype.mulMat = function(_mat2x2) {
	var r = new Vec2(this.x, this.y);
	var x = this.x * _mat2x2.m[0][0] + this.y * _mat2x2.m[0][1];
	var y = this.x * _mat2x2.m[1][0] + this.y * _mat2x2.m[1][1];
	r.x = x;
	r.y = y;
	return r;
};

Vec2.prototype.addVec2 = function(_v) {
	var r = new Vec2(this.x, this.y);
	r.x = this.x + _v.x;
	r.y = this.y + _v.y;
	return r;
};

Vec2.prototype.normalize = function() {
	if (this.x == 0 && this.y == 0)
		return Vec2.ZERO;
	var u = Math.sqrt((this.x * this.x) + (this.y * this.y));
	var x = this.x/u;
	var y = this.y/u;
	return new Vec2(x,y);
};

Vec2.prototype.equal = function(_v) {
	return _v.x == this.x && _v.y == this.y;
}

/** 
 * Mat2x2 Class
 */

Mat2x2 = function (_a, _b, _c, _d) {
	this.m = new Array();
	this.m[0] = new Array();
	this.m[1] = new Array();
	this.m[0][0] = _a;
	this.m[0][1] = _b;
	this.m[1][0] = _c;
	this.m[1][1] = _d;
};

Mat2x2.prototype.inverse = function() {
	var r = new Mat2x2(this.m[0][0], this.m[0][1], this.m[1][0], this.m[1][1]);
	var det = (this.m[0][0] * this.m[1][1]) - (this.m[0][1] * this.m[1][0]);
	
	var a = (this.m[0][0])/ det;
	r.m[0][0] = (this.m[1][1])/ det;
	r.m[1][1] = a;
	
	r.m[0][1] = (r.m[0][1] * -1)/det;
	r.m[1][0] = (r.m[1][0] * -1)/det;
	
	return r;
};