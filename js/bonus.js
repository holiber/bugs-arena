!function () {
	var Bonus = Game.classes.Bonus = Game.GameObject.extend({

		init: function (params) {
			this.params = $.extend({x: 0, y: 0, type: 'apple'},params);
			this.captured = false;
			this.x = this.params.x;
			this.y = this.params.y;
			this.type = this.params.type;
			this.isColliding = true;
			this.frame = 0;
			this.birthFrames = 20;
		},

		birth: function () {
			this.$el = $('<div class="go go-bonus bonus-' + this.type + '"></div>').appendTo(this.game.$arena);
			this.width = this.$el.width();
			this.height = this.$el.height();
			this.size = this.width;
			var collisions = this.getCollisions();
			if (collisions.length) this.die();
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
			var x = this.x;
			var y = this.y;
			var size = this.size;
			if (this.frame < this.birthFrames) {
				size = size * (this.frame / this.birthFrames);
				x = x + (this.size - size);
				y = y + (this.size - size);
			}
			var css = {
				display: 'block',
				left: x,
				top: y,
				width: size,
				height: size
			}
			this._super(css);
		}

	})
}();