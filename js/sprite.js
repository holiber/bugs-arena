!function () {

	var Sprite = Game.classes.Sprite = Game.GameObject.extend({

		init: function (params) {
			this._super();
			this.params = $.extend({
				x: 0,
				y: 0,
				sprite: '',
				angle: 0,
				frames: 150,
				animation: 'fadeOut',
				css: {}
			}, params);
			this.x = this.params.x;
			this.y = this.params.y;
			this.frame = 0;
		},

		birth: function () {
			this.$el = $('<div class="go go-sprite spr-' + this.params.sprite + '"></div>').appendTo(this.game.$arena);
			this.size = this.$el.width();
		},

		step: function () {
			if (this.frame > this.params.frames) {
				this.die();
				return;
			}
			this.frame++;
			this.render();
		},

		render: function () {
			var css = $.extend({
				display: 'block',
				left: this.x,
				top: this.y,
				opacity: 1,
				width: this.size,
				height: this.size
			}, this.params.css);

			var middleFrame = Math.round(this.params.frames / 2);

			if (this.params.animation == 'fadeOut') {
				css.opacity = 1 - this.frame / this.params.frames;
			}

			if (this.params.animation == 'grow') {
				css.width = this.size * (this.frame / this.params.frames) * 2;
				css.height = css.width;
				css.left = this.x - css.width / 2;
				css.top = this.y - css.height / 2;
				if (this.frame > middleFrame) {
					css.opacity = 1 - (this.frame - middleFrame) / (this.params.frames - middleFrame);
				}
			}

			if (this.params.animation == 'decrease') {
				var scale = 1 - this.frame / this.params.frames;
				css.opacity = scale;
				css.width = this.size * scale;
				css.height = this.size * scale;
				css.left = this.x - css.width / 2;
				css.top = this.y - css.height / 2;
			}

			this.$el.css(css);
		}

	})

}();