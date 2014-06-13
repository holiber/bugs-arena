!function () {
	var Vec = Game.Vec;

	var DEFAULT_WEAPON = {
		min: 20,
		max: 30,
		reloadTime: 70,
		reloadTimeLeft: 0,
		type: null
	};

	var DEFAULT_FIGHT = {
		enemy: null,
		age: null,
		lot: null,
		frame: 0,
		maxFrames: 9,
		isAttack: false,
		handshake: false,
		rotation: null
	};

	var LEVELS = {
		1: 0,
		2: 150
	}

	this.Game.classes.Bug = Game.GameObject.extend({

		init: function (params) {
			this._super();
			if (typeof params == 'string') {
				params = {
					team: params,
					x: null,
					y: null
				}
			}
			this.isColliding = true;
			this.player = null;
			this.maxSpeed = 4;
			this.maxSD = 2;// max speed delta
			this.x = params.x;
			this.y = params.y;
			this.speed = new Game.Vec();
			this.width = 0;
			this.height = 0;
			this.$el = null;
			this.frame = 0;
			this.age = 0;
			this.size = 0;
			this.team = params.team;
			this.hp = 100;
			this.maxHp = 100;
			this.angle = 0;
			this.weapon = $.extend({}, DEFAULT_WEAPON);
			this.fight = $.extend({}, DEFAULT_FIGHT);
			this.$sprite = null;
			this.$hpBar = null;
			this.$hpBarValue = null;
			this.$rank = null;
			this.xp = 0;
			this.spawnXp = 0;
			this.maxSpawnXp = 15;
			this.speedDispersion = 0.1;
			this.target = null;
			this.level = 1;
			this.highlightTime = 0;
			this.poisonTime = 0;
			this.showHpTime = 0;
		},

		birth: function () {
			this.$el = $('<div class="go go-bug"><div class="sprite"><div class="rank"></div></div><div class="hp-bar"><div class="value"></div></div></div>').appendTo(this.game.$arena);
			this.$sprite = this.$el.find('.sprite');
			this.$hpBar = this.$el.find('.hp-bar');
			this.$hpBarValue = this.$el.find('.value');
			this.$rank = this.$el.find('.rank');
			this.width = this.$el.width();
			this.height = this.$el.height();
			this.size = this.height;
			if (this.x === null || this.y === null) {
				this.x = Math.random() * this.game.arenaWidth;
				this.y = Math.random() * this.game.arenaHeight;
			}
			for (var playerId in this.game.players) {
				var player = this.game.players[playerId];
				if (player.team == this.team) {
					player.addUnit(this);
					break;
				}
			}
		},

		setTarget: function (target) {
			this.unsetTarget();
			this.target = target;
			this.highlight();
		},

		unsetTarget: function () {
			if (!this.target) return;
			this.target.captured = true;
			this.target = null;
		},

		die: function () {
			this._super();
			this.hp = 0;
			this.$el.remove();
			this.unsetTarget();
			this.player && this.player.removeUnit(this.id);
			this.game.create('Sprite', {
				x: this.x,
				y: this.y,
				sprite: 'bug-crashed'
			});
		},

		fire: function (type, target) {
			var wc = this.getWorldCenter();
			target = target || this.findNearest(function (gameObject) {
				return (gameObject instanceof Game.classes.Bug) && gameObject.team != this.team;
			}.bind(this));
			this.game.create('Bullet', {x: wc.x, y: wc.y, unit: this, type: type, target: target});
		},

		highlight: function () {
			this.highlightTime = 20;
		},

		poison: function () {
			this.poisonTime = 60;
		},

		showHp: function () {
			this.showHpTime = 40;
		},

		step: function () {

			// hp
			if (this.hp <= 0) {
				this.die();
				return;
			}

			var vec = new Game.Vec(this.x, this.y);

			// collisions
			var arenaWidth = this.game.arenaWidth;
			var arenaHeight = this.game.arenaHeight;
			this.collisionsHandler();


			// reload weapon
			if (this.weapon.reloadTimeLeft) this.weapon.reloadTimeLeft--;

			// move
			if (!this.fight.enemy) {
				if (!this.target) {
					var dx = this.game.random() * this.maxSD - this.maxSD / 2;
					var dy = this.game.random() * this.maxSD - this.maxSD / 2;
					this.speed.add({x: dx, y: dy});
				} else {
					this.speed.x = this.maxSpeed;
					this.speed.y = this.maxSpeed;
				}

				this.speed.maxV({x: this.maxSpeed, y: this.maxSpeed});
				if (this.poisonTime) this.speed.maxV({x: 0.5, y: 0.5});


				if (this.target) {
					var vecToTarget = vec.vectorTo({x: this.target.x, y: this.target.y});
					this.speed.rotate(vecToTarget.angle());
					var dispersion = this.game.getRandomElement([0,1]) ? this.speedDispersion : - this.speedDispersion;
					this.speed.rotate(this.speed.angle() + dispersion);
				}


				this.x += this.speed.x;
				this.y += this.speed.y;

				if (this.x > arenaWidth - this.size) {
					this.speed.x = -this.speed.x / 2;
					this.x = arenaWidth - this.size;
				}

				if (this.x < 0) {
					this.speed.x = -this.speed.x / 2;
					this.x = 0
				}
				if (this.y > arenaHeight - this.size) {
					this.speed.y = -this.speed.y / 2;
					this.y = arenaHeight - this.size;
				}
				if (this.y < 0) {
					this.speed.y = -this.speed.y / 2;
					this.y = 0
				}

				this.angle = this.speed.angle();
			}

			this.highlightTime && this.highlightTime--;
			this.poisonTime && this.poisonTime--;
			this.showHpTime && this.showHpTime--;
			this.age++;
			this.render();
		},

		render: function () {
			var x = this.x;
			var y = this.y;
			var frameClass = 'frame-' + this.frame;
			this.$el.removeClass(frameClass);
			if (this.age % 5 == 0) this.frame++;
			if (this.frame > 1) this.frame = 0;
			frameClass = 'frame-' + this.frame;
			this.$el.addClass(frameClass);

			var rank = '';
			if (this.maxHp >= 150) {
				rank = 'health';
			}
			if (this.weapon.min >= 50) {
				rank = 'damage';
			}
			this.$rank.removeClass('health damage');
			this.$rank.addClass(rank);

			if (this.fight.enemy || this.showHpTime) {
				var live = this.hp / this.maxHp;
				var hpColor = 'green';
				if (live < 0.6) hpColor = 'orange';
				if (this.hp < 0.25) hpColor = 'red';
				this.$hpBarValue.css({width: live * 100 + '%', backgroundColor: hpColor});
				this.$hpBar.css({display: 'block'});
			} else {
				this.$hpBar.css({display: 'none'});
			}

			if (this.fight.isAttack) {
				var middleFrame = Math.round(this.fight.maxFrames / 2);
				var attackDistance = this.fight.frame <= middleFrame ? this.fight.frame / middleFrame : (middleFrame + (middleFrame - this.fight.frame)) / middleFrame;
				var direction = new Vec(1,0);
				direction.rotate(this.angle);
				x += direction.x * attackDistance * 15;
				y += direction.y * attackDistance * 15;
			}

			this.$el.css({
					display: 'block',
					left: x,
					top: y
			});

			var boxShadowSize = this.highlightTime ? 3 : 0;
			this.$sprite.css({
				transform: 'rotate(' + this.angle + 'rad)',
				boxShadow: '0 0 10px ' + boxShadowSize + 'px ' + this.team
			});

		},

		attack: function (enemy) {
			var isNewFight = !this.fight.enemy;
			this.fight.enemy = enemy;

			if (isNewFight) {
				var oldAngle = this.angle;
				this.angle = new Vec(this.x, this.y).vectorTo({x: enemy.x, y: enemy.y}).angle();
				this.fight.rotation = Math.abs(Game.utils.angleDistance(oldAngle, this.angle));
				this.fight.frame = 0;
				this.fight.handshake = true;
				return;
			}

			if (this.fight.handshake == true) {
				this.fight.handshake = false;
				if (enemy.fight.rotation <= this.fight.rotation) {
					this.weapon.reloadTimeLeft = Math.round(this.weapon.reloadTime / 2);
				}
			}

			var canAttack = this.weapon.reloadTimeLeft == 0;
			if (canAttack && !this.fight.isAttack) {
				this.fight.isAttack = true;
				this.fight.frame = 1;
				this.weapon.reloadTimeLeft = this.weapon.reloadTime;
			} else if (this.fight.isAttack) {
				this.fight.frame++;
				var middleFrame = Math.round(this.fight.maxFrames / 2);
				if (this.fight.frame == middleFrame) {
					var power = Math.round(this.game.random() * (this.weapon.max - this.weapon.min) + this.weapon.min);
					if (enemy.hp <= 0) return;
					enemy.damage(power);
					//prepare blood
					var bloodVec = new Vec(1, 0);
					var angle = this.angle;
					bloodVec.rotate(angle);
					bloodVec.multiply(this.size * 2.5);
					bloodVec.add({x: this.x, y: this.y});
					var bloodCfg = {x: bloodVec.x, y: bloodVec.y, angle: angle + Math.PI, frames: 50}

					var enemyIsKilled = enemy.hp <= 0;
					if (enemyIsKilled) {
						bloodCfg.frames = 100;
						this.game.create('Blood', bloodCfg);
						this.onEnemyKill(enemy);
					} else {
						this.game.create('Blood', bloodCfg);
						this.text(power);
					}
				}
				if (this.fight.frame == this.fight.maxFrames) {
					this.fight.isAttack = false;
				}
			}
		},

		stopAttack: function () {
			if (this.fight.frame >= this.fight.maxFrames) {
				this.fight = this.fight = $.extend({}, DEFAULT_FIGHT);
			} else {
				this.fight.frame++;
			}
		},

		onEnemyKill: function (enemy) {
			this.addXp(10);
			if (this.player && enemy.player) {
				this.game.msg('<span class="' + this.player.team + '">' + this.player.name + '</span> kill ' +
					'<span class="' + enemy.player.team + '">' + enemy.player.name + '</span>'
				);
				this.player.stats.kills++;
			}
		},

		damage: function (power) {
			this.hp-= power;
			this.showHp();
		},

		text: function (text) {
			this.game.create('FxText', {
				color: this.team,
				text: text,
				x: this.x,
				y: this.y - 10
			});
		},

		collisionsHandler: function () {
			var collisions = this.getCollisions();
			if (collisions.length) {
				var object = this.game.objects[collisions[0]];
				if (object instanceof Game.classes.Bug) {
					if (object.team != this.team) {
						this.speed.setZero();
						this.attack(object);
					} else {
						this.stopAttack();
					}
				}

				if (object instanceof Game.classes.Target) {
					if (this.target && this.target.id == object.id) this.unsetTarget();
				}

				if (object instanceof Game.classes.Bonus && !object.captured) {
					this.captureBonus(object)
				}

				if (object instanceof Game.classes.Block) {
					this.meetBlock(object)
				}

			} else {
				if (this.fight.enemy) this.stopAttack();
			}
		},

		captureBonus: function (bonus) {
			bonus.captured = true;
			if (bonus.type == 'apple') {
				var bonusHp = 50;
				this.hp+= bonusHp;
				if (this.hp > this.maxHp) {
					bonusHp = bonusHp - (this.hp - this.maxHp);
					this.hp = this.maxHp;
				}
				if (bonusHp)
					this.text('+' + bonusHp + 'hp');
				else {
					this.maxHp += 15;
					this.hp = this.maxHp;
					this.text('+' + 15 + 'mh');
				}
			}
			if (bonus.type == 'cake') this.addXp(5);
			if (bonus.type == 'pepper') {
				this.weapon.min += 5;
				this.weapon.max += 5;
				this.text('+5dm');
			}
			if (bonus.type == 'acorn') {
				this.fire('acorn');
				this.addXp(2);
			}
			if (bonus.type == 'amanita') {
				this.fire('poison');
				this.addXp(1);
			}
			this.player.stats.items++;
		},

		addXp: function (xp) {
			var event = null;

			var nextLevelXp = LEVELS[this.level + 1];
			this.xp += xp;

			if (nextLevelXp && this.xp >= nextLevelXp) {
				event = 'level up';
				this.level++;
				this.maxHp += 100;
				this.hp += 100;
				this.weapon.max += 10;
				this.weapon.type = 'poison';
				this.$el.addClass('level-2');
				this.width = this.$el.width();
				this.height = this.$el.height();
				this.size = this.height;
			}

			this.spawnXp += xp;
			if (this.spawnXp >= this.maxSpawnXp) {
				this.spawn();
				this.spawnXp = 0;
				event = 'spawn';
			}
			if (!event) this.text('+' + xp + 'xp');
			return event;
		},

		spawn: function () {
			this.speed.normalize();
			this.speed.multiply(0.1);
			this.game.create('Bug', {team: this.team, x: this.x, y: this.y});
			this.player.stats.units++;
			this.text('Spawn!');
		},

		meetBlock: function (block) {
			this.unsetTarget();
			this.speed = this.speed.negative();
			block.kick();
		},


		getCollisions: function () {
			var collisions = [];
			for (var id in this.game.collidingObjects) {
				if (id == this.id) continue;
				var object = this.game.collidingObjects[id];
				var distance = this.getWorldCenter().distanceTo(object.getWorldCenter());
				if (object instanceof Game.classes.Bug) {
					if (distance <= this.size + object.size) collisions.push(id);
				} else {
					if (distance <= this.size / 2 + object.size / 2) collisions.push(id);
				}
			}
			return collisions;
		}
	});

}();
