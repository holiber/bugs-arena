!function () {
	var FxText = Game.classes.FxText = Game.GameObject.extend({

		init: function (params) {
			this._super();
			this.params = $.extend({color: 'orangered', text: '!', x: 0, y: 0}, params);
			this.frames = 50;
			this.frame = 0;
			this.x = params.x;
			this.y = params.y;
		},

		birth: function () {
			this.$el = $('<div class="go go-fx-text">' + this.params.text + '</div>').appendTo(this.game.$arena);
			this.width = this.$el.width();
		},

		step: function () {
			if (this.frame == this.frames) {
				this.die();
				return;
			}
			this.frame++;
			this.y = this.y-2;
			this.render();
		},

		render: function () {
			var y = this.y;
			var x = this.x - this.width / 2;
			var opacity = 1 - this.frame / this.frames;
			this.$el.css({
				display: 'block',
				top: y,
				left: x,
				opacity: opacity,
				color: this.params.color
			})
		}
	});
}();