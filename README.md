# Bugs arena
Multiplayer game on JavaScript, HTML and CSS3
![preview](https://raw.githubusercontent.com/holiber/bugs-arena/master/docs/preview.png)

[WATCH VIDEO](http://www.youtube.com/watch?v=AHYeoVX5d9c)   
[PLAY ONLINE](http://bugsarena.alexclimber.com)

## Game overview
Grow your colony of beetles and destroy the enemy bugs.  
Collect useful bonuses for excellence:  
![bonuses](https://raw.githubusercontent.com/holiber/bugs-arena/master/docs/bonuses.png)

## Quick launch
Install client dependencies

```sh
npm install
```

Install server dependencies:

```sh
cd server
npm install
```

Run the game
```sh
    npm run dev
```

That starts:
 - game server with an game room
 - lobby server to track all existing game servers
 - http client


# Server configuration
Run server with default settings:

```sh
node server.js
```

Run server with custom settings:

```sh
node server.js name="My bugsarena server" port="8099" map="FourSectors" bots="Jerry,Perry,Marry"
```
