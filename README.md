#Bugs arena
Multiplayer game on JavaScript, HTML and CSS3
![preview](https://raw.githubusercontent.com/holiber/bugs-arena/master/docs/preview.png)

[PLAY ONLINE](http://bugsarena.alexclimber.com)

##Game overview
Grow your colony of beetles and destroy the enemy bugs.  
Collect useful bonuses for excellence:  
![bonuses](https://raw.githubusercontent.com/holiber/bugs-arena/master/docs/bonuses.png)

##Start client
Install dependences by `bower install` and run index.html on your webserver

##Start server

Install server packages:

```sh
sd server
npm install
```

Run server with default settings:

```sh
node server.js
```

Run server with custom settings:

```sh
node server.js name="My bugsarena server" port="8099" map="FourSectors"
```