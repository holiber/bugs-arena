!function () {

	var WEAPON = {
		acorn: {
			speed: 10,
			rotation: 0
		},
		poison: {
			speed: 10,
			rotation: 0.1,
			dispersion: 0.2
		}
	}

	var Bullet = Game.classes.Bullet = Game.GameObject.extend({

		init: function (params) {
			this.params = $.extend({x: 0, y: 0, type: 'acorn', unit: null, target: null}, params);
			this.isColliding = true;
			this.x = this.params.x;
			this.y = this.params.y;
			this.angle = this.params.angle;
			this.type = this.params.type;
			this.unit = this.params.unit;
			this.target = this.params.target;
			this.size = 20;
			this.frames = 0;
			this.weapon = WEAPON[this.type];
			this.affectedTargets = [];
		},

		birth: function () {
			var pos = new Game.Vec(this.x, this.y);
			this.angle = pos.vectorTo({x: this.target.x, y: this.target.y}).angle();
			if (this.type != 'acorn') return;
			this.$el = $('<div class="go go-sprite spr-acorn"></div>').appendTo(this.game.$arena);
			this.size = this.$el.width();
		},

		step: function () {

			var delta = new Game.Vec(this.weapon.speed, 0);
			delta.rotate(this.angle);
			this.x += delta.x;
			this.y += delta.y;

			if (this.weapon.rotation && this.target) {
				var pos = new Game.Vec(this.x, this.y);
				var angleToTarget = pos.vectorTo({x: this.target.x, y: this.target.y}).angle();
				var angleDiff = Game.utils.angleDistance(angleToTarget, this.angle);
				if (angleDiff > 0) this.angle -= this.weapon.rotation;
				if (angleDiff < 0) this.angle += this.weapon.rotation;
			}

			if (this.weapon.dispersion) {
				if (this.game.getRandomElement([0,1])) {
					this.angle += this.weapon.dispersion;
				} else {
					this.angle -= this.weapon.dispersion;
				}
			}

			if (this.outOfRange()) {
				this.die();
				return;
			}

			this.collisionsHandler();

			if (this.type == 'acorn') {
				this.game.create('Sprite', {
					x: this.x - this.size / 2,
					y: this.y - this.size / 2,
					frames: 30,
					sprite: 'steam',
					animation: 'fadeOut'
				});

			} else {
				this.game.create('Sprite', {
					x: this.x,
					y: this.y,
					frames: 30,
					sprite: 'poison',
					animation: 'decrease'
				});
			}

			this.frames++;

			this.render();
		},

		explode: function () {
			if (this.type == 'poison') {
				this.game.create('Sprite', {
					x: this.x,
					y: this.y,
					frames: 50,
					sprite: 'poison',
					animation: 'grow'
				});
				return;
			}
			this.game.create('Sprite', {
				x: this.x,
				y: this.y,
				frames: 50,
				sprite: 'steam',
				animation: 'grow'
			});
			this.die();
		},

		collisionsHandler: function () {
			var collisions = this.getCollisions();
			for (var i = 0; i < collisions.length; i++) {
				var obj = this.game.collidingObjects[collisions[i]];
				if (!(obj instanceof Game.classes.Bug) || obj.team == this.unit.team) continue;
				if (obj.hp < 0) continue;
				if (~this.affectedTargets.indexOf(obj.id)) continue;

				var damages = {
					acorn: this.unit.weapon.min * 3,
					poison: Math.round(this.unit.weapon.max / 2)
				}

				var damage = damages[this.type];
				obj.hp -= damage;
				obj.text('-' + damage);

				if (obj.hp <= 0) this.unit.onEnemyKill(obj);

				if (this.type == 'poison') {
					this.target = null;
					this.affectedTargets.push(obj.id);
					obj.poison();

				}

				this.explode();

			}
		},

		render: function () {
			if (!this.$el) return;
			var css = {
				display: 'block',
				left: this.x - this.size / 2,
				top: this.y - this.size / 2,
				transform: 'rotate(' + this.angle + 'rad)'
			}
			this.$el.css(css);
		}

	})
}();