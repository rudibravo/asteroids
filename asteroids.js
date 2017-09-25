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
 * Static Defines
 */

var StaticDefines = {
	canvas : document.getElementById('main'),
	ctx : this.canvas.getContext('2d'),
	canvasWidth : parseInt(this.canvas.width),
	canvasHeight : parseInt(this.canvas.height),
	shotLifetime : 1000,
	//asteroids shouldn't colide with each other, they should only collide with player and shots
	shipCategoryBits : 0x0004, 
	shipMaskBits : 0x0002,
	shipTurningAngle : 0.05,
	shipMaxVelocity : 100,
	shipAcceleration : 250,
	asteroidMaxVelocityEachAxis : 35,
	asteroidMinVelocityEachAxis : 10,
	asteroidScoreBase : 60,
	getReadyTime : 2000,
}

/**
 * Actor class
 */

var Actor = function(_body) {
	this.body = _body;
}

Actor.prototype.step = function(_dt) {
	if (this.body.GetCenterPosition().x < 0) {
		this.body.GetCenterPosition().x = StaticDefines.canvasWidth;
	} else if (this.body.GetCenterPosition().x > StaticDefines.canvasWidth) {
		this.body.GetCenterPosition().x = 0;
	}
	if (this.body.GetCenterPosition().y < 0) {
		this.body.GetCenterPosition().y =  StaticDefines.canvasHeight;
	} else if (this.body.GetCenterPosition().y > StaticDefines.canvasHeight) {
		this.body.GetCenterPosition().y = 0;
	}
}

Actor.prototype.destroy = function() {
	//do nothing
}

/**
 * Ship class
 */

var Ship = function() {
	this.shapeDef = new b2PolyDef();
	this.shapeDef.vertexCount = 3
	this.shapeDef.vertices[0].Set(8,0);
	this.shapeDef.vertices[1].Set(-8,0);
	this.shapeDef.vertices[2].Set(0,-20);
	this.shapeDef.density = 1.0;
	this.shapeDef.friction = 0;
	this.shapeDef.linearDamping = 0;
	this.shapeDef.categoryBits = StaticDefines.shipCategoryBits;
	this.shapeDef.maskBits = StaticDefines.shipMaskBits;
	var shapeBd = new b2BodyDef();
	shapeBd.AddShape(this.shapeDef);
	shapeBd.position.Set(320,240);
	var shapeBody = World.b2World.CreateBody(shapeBd);
	Actor.call(this, shapeBody);
	this.angle = 0;
	this.shoot = 0;
}

Ship.prototype = new Actor();

Ship.prototype.constructor = Ship;

Ship.prototype.shootNow = function() {
	if (Game.dead)
		return;
	var circleSd = new b2CircleDef();
	circleSd.density = 1.0;
	circleSd.radius = 1;
	circleSd.categoryBits = StaticDefines.shipCategoryBits;
	var circleBd = new b2BodyDef();
	circleBd.AddShape(circleSd);
	var v = b2Math.AddVV(this.body.m_position, b2Math.b2MulMV(this.body.m_R, this.shapeDef.vertices[2]));
	circleBd.position.Set(v.x,v.y);
	circleBd.bullet = true;
	var circleBody = World.b2World.CreateBody(circleBd);
	circleBody.SetLinearVelocity(new b2Vec2((v.x - this.body.GetCenterPosition().x)*10, (v.y - this.body.GetCenterPosition().y)*10));

	World.actors.push(new Shot(circleBody));
}

/**
 * Shot class
 */

var Shot = function(_body) {
	Actor.call(this, _body);
	this.lifeTime = StaticDefines.shotLifetime;
}

Shot.prototype = new Actor();

Shot.prototype.constructor = Shot;

Shot.prototype.step = function(_dt) {
	this.lifeTime -= _dt;
	if (this.lifeTime < 0) {
		World.toKillActors.push(this);
	}
	Actor.prototype.step.call(this, _dt);
}


/**
 * Asteroid class
 */

var Asteroid = function(_x, _y, _velX, _velY, _type) {
	//type 3 is the biggert, type 2 is the medium, type 1 is the smallest
	this.type = _type;
	this.body = this.setupBody(_x, _y, _velX, _velY);
	Actor.call(this, this.body);
	Game.totalAsteroids++;
}

Asteroid.prototype = new Actor();

Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.setupBody = function(_x, _y, _velX, _velY) {
	var shapeDef = new b2PolyDef();
	shapeDef.vertexCount = 7;
	//setting up shape according to type.
	switch(this.type) {
		case 1:
			shapeDef.vertices[0].Set(5,0);
			shapeDef.vertices[1].Set(-5,-2);
			shapeDef.vertices[2].Set(-9,-10);
			shapeDef.vertices[3].Set(0,-17);
			shapeDef.vertices[4].Set(11,-15);
			shapeDef.vertices[5].Set(17,-10);
			shapeDef.vertices[6].Set(15,-5);
			break;
		case 2:
			shapeDef.vertices[0].Set(10,0);
			shapeDef.vertices[1].Set(-10,-5);
			shapeDef.vertices[2].Set(-18,-20);
			shapeDef.vertices[3].Set(0,-35);
			shapeDef.vertices[4].Set(22,-30);
			shapeDef.vertices[5].Set(35,-20);
			shapeDef.vertices[6].Set(30,-10);
			break;
		case 3:
			shapeDef.vertices[0].Set(20,0);
			shapeDef.vertices[1].Set(-20,-10);
			shapeDef.vertices[2].Set(-36,-40);
			shapeDef.vertices[3].Set(0,-70);
			shapeDef.vertices[4].Set(44,-60);
			shapeDef.vertices[5].Set(70,-40);
			shapeDef.vertices[6].Set(60,-20);
			break;
	}
	shapeDef.density = 1.0;
	shapeDef.friction = 0;
	shapeDef.linearDamping = 0;
	shapeDef.categoryBits = StaticDefines.shipMaskBits;
	shapeDef.maskBits = StaticDefines.shipCategoryBits;
	var shapeBd = new b2BodyDef();
	shapeBd.AddShape(shapeDef);
	shapeBd.position.Set(_x,_y);
	var shapeBody = World.b2World.CreateBody(shapeBd);
	shapeBody.SetLinearVelocity(new b2Vec2(_velX,_velY));
	return shapeBody;
}

Asteroid.prototype.destroy = function() {
	Game.totalAsteroids--;
	//only score if player still alive
	if (!Game.dead)
		Game.score += StaticDefines.asteroidScoreBase/this.type;
	switch(this.type) {
		case 1:
		break;
		case 2:
			//creating two asteroids of type 2.
			//adding some randomness so it looks cool
			for (var i=0; i<2; i++) {
				var asteroid = new Asteroid( 
					this.body.GetCenterPosition().x + Math.floor(Math.random()*50), 
					this.body.GetCenterPosition().y + Math.floor(Math.random()*50),
					this.body.GetLinearVelocity().x + Sign(this.body.GetLinearVelocity().x)*Math.floor(10 + Math.random()*10), 
					this.body.GetLinearVelocity().y + Sign(this.body.GetLinearVelocity().y)*Math.floor(10 + Math.random()*10), 1);
				World.actors.push(asteroid);
			}
		break
		case 3:
			//creating two asteroids of type 1.
			//adding some randomness so it looks cool
			for (var i=0; i<2; i++) {
				var asteroid = new Asteroid( 
					this.body.GetCenterPosition().x + Math.floor(Math.random()*50), 
					this.body.GetCenterPosition().y + Math.floor(Math.random()*50),
					this.body.GetLinearVelocity().x + Sign(this.body.GetLinearVelocity().x)*Math.floor(10 + Math.random()*10), 
					this.body.GetLinearVelocity().y + Sign(this.body.GetLinearVelocity().y)*Math.floor(10 + Math.random()*10), 2);
				World.actors.push(asteroid);
			}
		break;
	}
}

/**
 * World
 */

var World = {
	actors : new Array(),
	toKillActors : new Array(),
	playerShip : null,
	inputManager : new InputManager(),
	b2World : null,
	timeStep : 1.0/60,
	iteration : 1,
	previousTimestamp : 0,
	setupWorld : function() {
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set(-1000, -1000);
		worldAABB.maxVertex.Set(1000, 1000);
		var gravity = new b2Vec2(0, 0);
		var doSleep = true;
		this.b2World = new b2World(worldAABB, gravity, doSleep); 
	},
	processInput : function() {
		//if game has started and is not on the "Get Ready" scene
		if (Game.hasStarted && !Game.load) {
			if (Keyboard.isKeyDown(KEYS.LEFT)) {
				this.playerShip.angle -= StaticDefines.shipTurningAngle;
				Math.max(0,this.playerShip.angle);
				this.playerShip.body.m_rotation = this.playerShip.angle;
				this.playerShip.body.WakeUp();
			}
			if (Keyboard.isKeyDown(KEYS.RIGHT)) {
				this.playerShip.angle += StaticDefines.shipTurningAngle;
				Math.min(2,this.playerShip.angle);
				this.playerShip.body.m_rotation = this.playerShip.angle;
				this.playerShip.body.WakeUp();
			}
			if (Keyboard.isKeyDown(KEYS.UP)) {
				this.playerShip.body.WakeUp();
				var velocity = this.playerShip.body.GetLinearVelocity();
				if (velocity.Length() < StaticDefines.shipMaxVelocity)
					this.playerShip.body.ApplyImpulse(this.playerShip.body.GetWorldVector(new b2Vec2(0,-StaticDefines.shipAcceleration)), 
						this.playerShip.body.GetWorldPoint(new b2Vec2(0,0)));
				else {
					//we don't want the player ship to accelerate forever, applying a small impulse backwards
					var stopForce = new b2Vec2(velocity.x*-0.1, velocity.y*-0.1);
					this.playerShip.body.ApplyImpulse(stopForce, this.playerShip.body.GetWorldPoint(new b2Vec2(0,0)));
				}
			} else {
				if (this.playerShip.body.GetLinearVelocity().Length() > 0) {
					var velocity = this.playerShip.body.GetLinearVelocity();
					//applying a small force backwards so the player ship stops slowly
					var stopForce = new b2Vec2(velocity.x*-0.5, velocity.y*-0.5);
					this.playerShip.body.ApplyImpulse(stopForce, this.playerShip.body.GetWorldPoint(new b2Vec2(0,0)));
				}
			}
			if (Keyboard.isKeyDown(KEYS.SPACE)) {
				if (this.playerShip.shoot < Date.now()) {
					this.playerShip.shootNow();
					this.playerShip.shoot = Date.now() + 300;
				}
			}
		} else {
			if (Keyboard.isKeyDown(KEYS.SPACE) && !Game.load) { //only restart if not on the "Get Ready" scene.
				Game.restart();
			}
		}
	},
	step : function(cnt) {
		this.processInput();
		
		var now = new Date().getTime();
		var dt = 0;
		if (this.previousTimestamp > 0)
			dt =  now - this.previousTimestamp;
		this.previousTimestamp = now;

		Game.step(dt);

		var playerKilled = false;
		for (var i=0; i<this.toKillActors.length; i++) {
			var j = this.actors.indexOf(this.toKillActors[i]);
			this.actors.splice(j,1);
			this.toKillActors[i].destroy();
			this.b2World.DestroyBody(this.toKillActors[i].body);
			if (this.toKillActors[i] == this.playerShip) {
				playerKilled = true;
			}
		}
		if (playerKilled) 
			Game.playerKilled();

		this.toKillActors = [];
		for (var i=0; i<this.actors.length; i++) {
			this.actors[i].step(dt);
		}

		StaticDefines.ctx.clearRect(0, 0, StaticDefines.canvasWidth, StaticDefines.canvasHeight);

		this.b2World.Step(1.0/60, 1);

		var i=0;
		for (var c = this.b2World.GetContactList(); c != null; c = c.m_next) {
			i++;
			if (c.m_manifoldCount > 0) {
				if (c.m_node1.other == this.playerShip.body || c.m_node2.other == this.playerShip.body) {
					this.toKillActors.push(this.playerShip);
				} else {
					for (var i=0; i<this.actors.length; i++) {
						if (this.actors[i].body == c.m_node1.other || this.actors[i].body == c.m_node2.other){
							if (this.toKillActors.indexOf(this.actors[i]) == -1)
								this.toKillActors.push(this.actors[i]);
						}
					}
				}
			}
		}

		drawWorld(this.b2World, ctx);

		setTimeout('World.step(' + (cnt || 0) + ')', 10);
	},
	destroyAll : function() {
		for (var i=0; i<this.actors.length; i++) {
			this.actors[i].destroy();
			this.b2World.DestroyBody(this.actors[i].body);
		}
		this.toKillActors = [];
		this.actors = [];
		this.playerShip = null;
	}
}

/**
 * Game
 */
var Game = {
	lifes : 3,
	hasStarted : false,
	gameOver : false,
	level : 1,
	dead : false,
	totalAsteroids : 0,
	score : 0,
	getReadyTime : StaticDefines.getReadyTime,
	load : false,
	step : function(_dt) {
		if (this.totalAsteroids <= 0 && !this.dead && !this.gameOver && this.hasStarted && !this.load) {
			this.level++;
			this.load = true;
		}
		if (this.dead) {
			if  (this.lifes <= 0) {
				this.startGameOver();
			}  else {
				if (!this.load) {
					this.getReadyTime = StaticDefines.getReadyTime;
					this.load = true;
				}
			}
		}
		
		if (this.hasStarted) {
			document.getElementById('div-score').innerHTML = "SCORE: " + this.score;
			document.getElementById('div-life').innerHTML = "LIFES: " + this.lifes;
			document.getElementById('div-main').innerHTML = "";
			document.getElementById('div-gameover').innerHTML = "";
		} else {
			document.getElementById('div-main').innerHTML = "Press [SPACE] to start.";
		}

		if (this.gameOver) {
			document.getElementById('div-gameover').innerHTML = "GAME OVER";
			document.getElementById('div-score').innerHTML = "SCORE: " + this.score;
			document.getElementById('div-life').innerHTML = "LIFES: " + this.lifes;
		}

		if (this.load) {
			document.getElementById('div-getready').innerHTML = "Get Ready ...";
		} else {
			document.getElementById('div-getready').innerHTML = "";
		}

		if (this.load) {
			this.getReadyTime -= _dt;
			if (this.getReadyTime <= 0) {
				this.load = false;
				this.loadLevel();
			}
		}
	},
	start : function() {
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set(-1000, -1000);
		worldAABB.maxVertex.Set(1000, 1000);
		var gravity = new b2Vec2(0, 0);
		var doSleep = true;
		World.b2World = new b2World(worldAABB, gravity, doSleep);

		World.step();
	},
	loadLevel : function() {
		this.unloadLevel();
		var playerShip = new Ship();
		World.playerShip = playerShip;
		World.actors.push(playerShip);
		this.dead = false;

		//some magic numbers here: that will give a progression like
		//3, 5, 7, 9, 11, ...
		for (var i=0; i<(this.level*2+1); i++) {
			var pos = getRandomAsteroidPos();
			var vel = getRandomAsteroidVelocity();
			var asteroid = new Asteroid( pos[0], pos[1] , vel[0], vel[1], 3);
			World.actors.push(asteroid);
		}
		canvasWidth = parseInt(canvas.width);
		canvasHeight = parseInt(canvas.height);
		this.getReadyTime = StaticDefines.getReadyTime;
	},
	unloadLevel : function() {
		World.destroyAll();
		this.totalAsteroids = 0;
	},
	startGameOver : function() {
		this.gameOver = true;
		this.hasStarted = false;
		this.level = 1;
	},
	playerKilled : function() {
		this.dead = true;
		this.lifes--;
	},
	restart : function() {
		this.gameOver = false;
		this.hasStarted = true;
		this.lifes = 3;
		this.load = true;
		this.score = 0;
		this.getReadyTime = 3000;
	}
}


function getRandomAsteroidPos() {
	var halfWidth = StaticDefines.canvasWidth / 2;
	var halfHeight = StaticDefines.canvasHeight / 2;
	var sX = (Math.random() > 0.5) ? 1 : -1;
	var sY = (Math.random() > 0.5) ? 1 : -1;
	//not placing it on the center of the screen, giving the player a chance to react
	var x = halfWidth + halfWidth/2*sX + Math.floor((Math.random()*halfWidth/2)*sX);
	var y = halfHeight + halfHeight/2*sY + Math.floor((Math.random()*halfHeight/2)*sY);
	return [x,y];
}

function getRandomAsteroidVelocity() {
	var sX = (Math.random() > 0.5) ? 1 : -1;
	var sY = (Math.random() > 0.5) ? 1 : -1;
	var x = Math.floor(Math.random()*StaticDefines.asteroidMaxVelocityEachAxis + StaticDefines.asteroidMinVelocityEachAxis) * sX;
	var y = Math.floor(Math.random()*StaticDefines.asteroidMaxVelocityEachAxis + StaticDefines.asteroidMinVelocityEachAxis) * sY;
	return [x,y];
}

function drawWorld(world, context) {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}

function drawShape(shape, context) {
	context.strokeStyle = '#ffffff';
	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// draw circle
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
		}
		break;
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);
		}
		break;
	}
	context.stroke();
}

/**
 * Game main execution
 */

Game.start();
World.setupWorld();