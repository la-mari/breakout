var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
	preload: preload, create: create, update: update
});

var pelota;
var paddle;
var ladrillo;
var newLadrillo;
var ladrilloInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;

function preload() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.stage.backgroundColor = '#eee';
	game.load.image('pelota', 'img/pelota.png');
	game.load.image('paleta', 'assets/paleta.png');
	game.load.image('ladrillo', 'assets/ladrillo.png');

}

function create() {
	//initialize the arcade physics engine
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//position the ball
	pelota = game.add.sprite(game.world.width*0.5, game.world.height-25, 'pelota');
	pelota.anchor.set(0.5);

	game.physics.enable(pelota, Phaser.Physics.ARCADE);
	//set walls as boundaries so ball stops at wall
	pelota.body.collideWorldBounds = true;
	pelota.body.bounce.set(1);
	pelota.body.velocity.set(150, -150);

	//no ball collision at bottom edge of screen, lose game
	game.physics.arcade.checkCollision.down = false;
	pelota.checkWorldBounds = true;
	pelota.events.onOutOfBounds.add(ballLeaves, this);

	//render the paddle
	paleta = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paleta');
	paleta.anchor.set(0.5,1);
	//enable physics so ball can hit paddle
	game.physics.enable(paleta, Phaser.Physics.ARCADE);
	//make paddle immoveable so it won't move when ball hits it
	paleta.body.immovable = true;

	initLadrillos();
	textStyle = { font: '18px Arial', fill: '#0095DD' };
	scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
	livesText = game.add.text(game.world.width-5, 5, 'Lives: '+lives, textStyle);
	livesText.anchor.set(1,0);
	lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.6, 'Life lost, click to continue', textStyle);
	lifeLostText.anchor.set(0.5);
	lifeLostText.visible = false;
}

function update() {
	game.physics.arcade.collide(pelota, paleta);
	//set paddle position to input positions
	paleta.x = game.input.x || game.world.width*0.5;

	//add collision detection
	game.physics.arcade.collide(pelota, ladrillos, pelotaPegaLadrillo);
	// pelota.x += 1;
	// pelota.y += 1;
}

//draw ladrillos
function initLadrillos(){
	ladrilloInfo = {
		width: 50,
		height: 20,
		count: {
			col: 7,
			row: 4
		},
		offset: {
			top: 50,
			left: 60
		},
		padding: 10
	}
	//add group to create the ladrillos
	ladrillos = game.add.group();
	for(i=0; i<ladrilloInfo.count.row; i++){
		for(j=0; j<ladrilloInfo.count.col; j++){
			var ladrilloX = (j*(ladrilloInfo.width+ladrilloInfo.padding))+ladrilloInfo.offset.left;
			var ladrilloY = (i*(ladrilloInfo.height+ladrilloInfo.padding))+ladrilloInfo.offset.top;
			newLadrillo = game.add.sprite(ladrilloX, ladrilloY, 'ladrillo');
			game.physics.enable(newLadrillo, Phaser.Physics.ARCADE);
			newLadrillo.body.immovable = true;
			newLadrillo.anchor.set(0.5);
			ladrillos.add(newLadrillo);
		}
	}
}

function pelotaPegaLadrillo(pelota, ladrillo){
	ladrillo.kill();
	score += 10;
	scoreText.setText('Points: '+score);
	//win scenario
	var count_alive = 0;

	//loop through ladrillos and check if each brick 'alive'
	for(i=0; i<ladrillos.children.length; i++){
		if(ladrillos.children[i].alive === true){
			count_alive++;
		}
	}
	if(count_alive == 0) {
		alert('HOORAY YOU WIN!');
		location.reload();
	}
}

function ballLeaves(){
		lives--;
		if(lives){
			livesText.setText('Lives: '+lives);
			lifeLostText.visible = true;
			pelota.reset(game.world.width*0.5, game.world.height-25);
			paleta.reset(game.world.width*0.5, game.world.height-5);
			game.input.onDown.addOnce(function(){
				lifeLostText.visible = false;
				pelota.body.velocity.set(150, -150);
			}, this);
		} else {
			alert('GAME OVER!');
			location.reload();
		}
	}

