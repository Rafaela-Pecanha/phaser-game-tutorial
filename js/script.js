(function(){
    // console.log(Phaser);
    // PHASER.AUTO É PRA VER DE FORMA AUTOMATICA SE VAI SER WebGL OU CANVAS
    // o null na verdade é o paramentro da div que está o jogo, null porque não está em nenhuma div
    // depois do null vem os state(niveis) do jogo
    var game = new Phaser.Game(800,550,Phaser.CANVAS,null,{preload:preload,create:create,update:update});
    
    var platforms, player, keys,stars, textScore, score=0;
    //preload carrega os recursos que vou usar durante o jogo, imagens, sons e etc
    function preload(){
        game.load.image('sky','img/sky.png');
        game.load.image('platform','img/platform.png');
        game.load.image('star', 'img/star.png');
        game.load.spritesheet('dude', 'img/dude.png',32,48);
    
    }
    //create cria os elementos que serão utilizados, como por exemplo variaveis e array
    function create(){
        //verifica se o usuario esta apertando as teclas
        keys = game.input.keyboard.createCursorKeys();
        //inicia estimulações fisicas
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //tudo qeu exibe na tela enquanto jogo é um sprite
        game.add.sprite(0,0,'sky');
        platforms = game.add.group();
        platforms.enableBody = true; //fazer com as plataformas sejam sólidas, também tem que fazer no update
        //game.world.height pega as dimensões da tela
        var platform = platforms.create(0,game.world.height -64,'platform')
        //platform.scale.setTo é para dobra ou dividr o tamanho da plataforma
        platform.scale.setTo(2,2);
        //plataforma não se move
        platform.body.immovable = true;

        platform = platforms.create(400,400, 'platform');
        platform.body.immovable = true;
        platform = platforms.create(-150,250, 'platform');
        platform.body.immovable = true;

        stars = game.add.group();
        stars.enableBody = true;

        for(var i = 0; i<12; i++){ //cria 12 estrelas
            var star = stars.create(i*70,0,'star'); //espaçamento entre as estrelas de 70
            star.body.gravity.y = 300;
            star.body.bounce.y = 0.7 + (Math.random()*0.2);
        }
        player = game.add.sprite(50,game.world.height - 150,'dude')

        game.physics.arcade.enable(player);
        //definir quais physics estaram atuando
        player.body.gravity.y = 300; //valor da gravidade
        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true; //colidi com as bordas do jogo
        player.animations.add('left', [0,1,2,3],10,true); //defini os frames pra direita
        player.animations.add('right', [5,6,7,8],10,true); //defini os frames pra esquerda
    
        textScore  = game.add.text(16,16,'SCORE: 0', {fontSize:'32px',fill: 'FFFFFF'});
    }


    
    //update fica a lógica de jogo que tem que ocorrer a cada interação
    function update(){
        //ve se os objetos estão colidindo
        game.physics.arcade.collide(player,platforms);
        game.physics.arcade.collide(stars,platforms);
        //overlap ver se está colidindo mas um elemento não bloquea o outro
        game.physics.arcade.overlap(player,stars,collectStar);
        player.body.velocity.x = 0;
        //aperta pra esquerda
        if(keys.left.isDown){
            player.body.velocity.x = - 150;
            //animação pra direita
            player.animations.play('left');
        }else
        //aperta pra direita
        if(keys.right.isDown){
            player.body.velocity.x = 150;
            //animação pra esquerda
            player.animations.play('right');
        } else {
            //definindo quando para o frame que fica
            player.animations.stop();
            player.frame = 4;
        }
        //player.body.touching.down é para só saltar se tiver na plataforma
        if(keys.up.isDown && player.body.touching.down){
            player.body.velocity.y = -350;
            
        }
        function collectStar(player,star){
          //kill elimina um sprite do jogo 
            star.kill();  
            score += 10;
            textScore.text = 'SCORE: ' + score;
        }
    }
}());
