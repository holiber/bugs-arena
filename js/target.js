!function () {
	var Target = Game.classes.Target = Game.GameObject.extend({

		init: function (params) {
			this.params = $.extend({x: 0, y: 0, team: ''},params);
			this.captured = false;
			this.x = this.params.x;
			this.y = this.params.y;
			this.team = this.params.team;
			this.isColliding = true;
			this.frame = 0;
			this.birthFrames = 20;
			this.unit = null;
		},

		birth: function () {
			this.$el = $('<div class="go go-target go-target-' + this.team + '"></div>').appendTo(this.game.$arena);
			this.width = this.$el.width();
			this.height = this.$el.height();
			this.size = this.width;

			for (var key in this.game.players) {
				var player = this.game.players[key];
				if (player.team == this.team && player.isActive) break
				else player = null;
			}

			if (!player) {
				this.die();
				return;
			}
			var vec = new Game.Vec(this.x, this.y);

			var nearestUnit = {id: null, distance: 0}
			for (var id in player.units) {
				var unit = player.units[id];
				if (!unit || unit.fight.enemy) continue;
				var distance = vec.distanceTo(unit);
				if (!nearestUnit.id || distance < nearestUnit.distance) {
					nearestUnit.id = unit.id
					nearestUnit.distance = distance;
				}
			}

			var unit = player.units[nearestUnit.id];
			unit && unit.setTarget(this);
		},

		step: function () {
			this.frame++;
			if (this.captured) {
				this.die();
				return
			}
			this.render();
		},

		render: function () {
			if (this.team != this.game.player.team) return;
			var x = this.x;
			var y = this.y;
			var size = this.size;

			this.$el.css({
				display: 'block',
				left: x,
				top: y,
				width: size,
				height: size
			});
		}

	})
}();