!function () {

	var FxLine = Game.classes.FxLine = Game.GameObject.extend({

		init: function (params) {
			this._super();
			this.params = $.extend({color: 'orangered', target1: {x: 0, y:0}, target2: {x: 0, y:0}} , params);
			this.frames = 50;
			this.frame = 0;
		},

		birth: function () {
			this.$el = $('<div class="go go-fx-line"></div>').appendTo(this.game.$arena);
		},

		step: function () {
			if (this.frame == this.frames || this.params.target1.isDead) {
				this.die();
				return;
			}
			this.frame++;
			this.render();
		},

		render: function () {
			var target1 = new Game.Vec(this.params.target1);
			var target2 = new Game.Vec(this.params.target2);
			var height = target1.distanceTo(target2);
			var angle = target1.angleTo(target2) + Math.PI;

			var opacity = 1 - this.frame / this.frames;
			this.$el.css({
				display: 'block',
				top: target1.y,
				left: target1.x,
				transform: 'rotate(' + angle + 'rad)',
				height: height,
				opacity: opacity,
				backgroundColor: this.params.color
			})
		}
	});
}();