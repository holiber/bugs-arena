!function () {

	var Blood = Game.classes.Blood = Game.classes.Sprite.extend({

		init: function (params) {
			this._super();
			this.params = $.extend({
				x: 0,
				y: 0,
				sprite: 'blood',
				angle: 0,
				frames: 100
			}, params);
			this.x = params.x;
			this.y = params.y;
			this.frame = 0;
		},

		birth: function () {
			this.$el = $('<img class="go go-sprite spr-' + this.params.sprite + '" src="img/blood.png"/>').appendTo(this.game.$arena);
		},

		render: function () {
			//var opacity = 1 - this.frame / this.params.frames;
			var middleFrame = Math.round(this.params.frames / 8);
			var size = this.frame <= middleFrame ? this.frame : middleFrame;
			size = size * 2 + 5;
			var opacity = this.frame <= middleFrame ? 1 : 1 - (this.frame - middleFrame) / (this.params.frames - middleFrame);
			this.$el.css({
				display: 'block',
				left: this.x,
				top: this.y,
				width: size,
				height: size,
				opacity: opacity,
				transform: 'rotate(' + this.params.angle + 'rad)'
			})
		}

	})

}();