!function () {

	var Block = Game.classes.Block = Game.GameObject.extend({

		init: function (params) {
			this._super();
			this.params = $.extend({
				x: 0,
				y: 0,
				maxHp: 100
			}, params);
			this.isColliding = true;
			this.x = this.params.x;
			this.y = this.params.y;
			this.maxHp = this.params.maxHp;
			this.hp = this.maxHp;
			this.kickReloadTime = 50;
			this.kickReloadTimeLeft = 0;
		},

		birth: function () {
			this.$el = $('<div class="go go-block"></div>').appendTo(this.game.$arena);
			this.size = this.$el.width();
		},

		die: function () {
			this._super();
			var wc = this.getWorldCenter();
			this.game.create('Sprite', {sprite: 'block', x: this.x, y: this.y, frames: 300});
		},

		step: function () {
			if (this.hp <= 0) {
				this.die();
				return;
			}
			if (this.kickReloadTimeLeft > 0) this.kickReloadTimeLeft--;
			this.render();
		},

		kick: function () {
			if (!this.kickReloadTimeLeft) {
				this.kickReloadTimeLeft = this.kickReloadTime;
				this.hp-=20;
				var wc = this.getWorldCenter();
				this.game.create('Sprite', {sprite: 'splinters', x: wc.x, y: wc.y, frames: 10, animation: 'grow'});
			}
		},

		render: function () {
			this.$el.removeClass('frame-0 frame-1 frame-2');
			var frame = 0;
			var hpQuote = this.hp / this.maxHp;
			if (hpQuote < 1) {frame = 1}
			if (hpQuote < 0.6) {frame = 2}
			if (hpQuote < 0.3) {frame = 3}
			this.$el.addClass('frame-' + frame);
			var css = {
				display: 'block',
				left: this.x,
				top: this.y
			}
			this._super(css);
		}

	})

}();