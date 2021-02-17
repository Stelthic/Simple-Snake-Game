import { ceil, round } from 'lodash';
import * as PIXI from 'pixi.js';
import * as fs from 'fs';

//Really simple 2d vector for simple storage of the values
class Vec2d {
    public x : number;
    public y : number;

    public constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
}

const Snake = new PIXI.Container(); //Holds the snake the player controls
let Speed : number = 5; //Movement Speed of the snake
let Direction : Vec2d = new Vec2d(0,0); //Direction of the snake
let AppleTile : Vec2d = new Vec2d(14,6); //Spawn location of the first apple
let LastFrameTilelist: Array<Vec2d> = []; //Last frames location of all the individual pieces of the snake
let counter : number = 0; //Used to calculate movement speed in seconds using deltatime
let dirx : number = 0; //Real movement direction of the snake Direction gets qued until the center of the tile is reached
let diry : number = 0; //Real movement direction of the snake Direction gets qued until the center of the tile is reached
let Score : number = 0; //Current score
let Paused : boolean = false; // if the game is paused
let GameOver : boolean = false; //Gameover state
const ScoreBoard = new PIXI.Text("Score: \n    " + String(Score)); //Scoreboard on screen
let HScore : number = 0; //Current sessions highscore
const HighScore = new PIXI.Text("  High \n Score: \n    " + String(HScore));//Highscore text on screen

const app = new PIXI.Application({
    antialias: true,
    width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

window.onload = () => {
    app.stage.addChild(CreateGrid(17, 15));
    CreateSnake(4);

    document.addEventListener('keydown', keyboardInput);
}

//Creates the playable area using a grid formation
function CreateGrid(Sizex : number, Sizey : number): PIXI.Container{

const container = new PIXI.Container();

for (let x = 0; x < Sizex; x++) {
    for (let y = 0; y < Sizey; y++) {
        const graphics = new PIXI.Graphics();

        graphics.lineStyle(2, 0xCBEDBC, 1);
        if ((x + y) % 2 == 0){
            graphics.beginFill(0x4CDC0E);
        } else {
            graphics.beginFill(0x44B613); 
        }
        graphics.drawRect(x * 40, y * 40, 40, 40);
        graphics.endFill();

        container.addChild(graphics);
        }
    }
    return container;
};

//Gets the Tile location on the grid with world cordinates
function GetTile(x : number, y : number): Vec2d{
    return (new Vec2d(ceil(x / 40), ceil(y / 40)));
};

//Gets the center world cordinates of the requested grid tile from grid position
function GetTilePosition(TileX : number, TileY : number): Vec2d{
    return (new Vec2d(TileX * 40 - 20 , TileY * 40 - 20));
};

//gets the center world cordinates of the grid tile from world cordinates
function GetTileCordinates(TileX : number, TileY : number): Vec2d{
    let temp = GetTile(TileX, TileY);
    return (GetTilePosition(temp.x, temp.y));
};


//Reads Keyboard input
function keyboardInput(event : KeyboardEvent){
    if(!Paused){
        //Arrow Left
        if(event.keyCode == 37 && Direction.x != Speed){
                Direction.x = -Speed;
                Direction.y = 0;
                Snake.getChildAt(0).angle = 270;
        }
        //Arrow Up
        else if (event.keyCode == 38 && Direction.y != Speed){
                Direction.x = 0;
                Direction.y = -Speed;
                Snake.getChildAt(0).angle = 0;
        }
        //Arrow Right
        else if (event.keyCode == 39 && Direction.x != -Speed){
                Direction.x = Speed;
                Direction.y = 0;
                Snake.getChildAt(0).angle = 90;
        }
        //Arrow Down
        else if (event.keyCode == 40 && Direction.y != -Speed){
                Direction.x = 0;
                Direction.y = Speed;
                Snake.getChildAt(0).angle = 180;
        }
    }
    //Space
    if (event.keyCode == 32){
       if(!Paused){
            Paused = true;
       } 
        else{
            Paused = false;
       }
       //Enter
    } else if (event.keyCode == 13) {
        StartGame();
    }
}

//Checks if the Arry contains the Tile using its grid position
//Function is used for collison detection with the apple or the snakes own body
function Contains(content : Array<Vec2d>, contain : Vec2d): boolean{
    for(let i = 1; i < content.length; i++){
        if(content[i].x == contain.x && content[i].y == contain.y){
            return true;
        }
    }
    return false;
}


//Initializes or resets all game values
function StartGame(){
    Direction = new Vec2d(0,0);
    counter = 0;
    dirx = 0;
    diry = 0;
    Score = 0;
    Paused = false;
    GameOver = false;
    LastFrameTilelist = [];

    //Reset the Snake
    const tempContainer = new PIXI.Container();
    for( let i = 0; i < 4; i ++){
        tempContainer.addChild(Snake.getChildAt(0)); 
    }

    Snake.removeChildren();

    for( let i = 0; i < 4; i ++){
        Snake.addChild(tempContainer.getChildAt(0));
    }

    //Manually sets the position of the Snake not really optimal
    Snake.getChildAt(0).position.x = GetTilePosition(5,6).x;
    Snake.getChildAt(0).position.y = GetTilePosition(5,6).y;
    Snake.getChildAt(1).position.x = GetTilePosition(4,6).x;
    Snake.getChildAt(1).position.y = GetTilePosition(4,6).y;
    Snake.getChildAt(2).position.x = GetTilePosition(3,6).x;
    Snake.getChildAt(2).position.y = GetTilePosition(3,6).y;
    Snake.getChildAt(3).position.x = GetTilePosition(2,6).x;
    Snake.getChildAt(3).position.y = GetTilePosition(2,6).y;

    Snake.getChildAt(0).angle = 90;

    for(let i = 0; i < Snake.children.length; i++){
        LastFrameTilelist.push(GetTile(Snake.getChildAt(i).position.x, Snake.getChildAt(i).position.y));
    }

    AppleTile = new Vec2d(14, 6);
    app.stage.getChildAt(2).position.set(GetTilePosition(AppleTile.x, AppleTile.y).x, GetTilePosition(AppleTile.x, AppleTile.y).y);

    ScoreBoard.text = "Score: \n    " + String(Score);
}

//Loads the textures for the Snake and the apple and then calls StartGame
function CreateSnake(SnakeSize : number){

    app.loader.add('SnakeScale', 'image/player.png');
    app.loader.add('Head', 'image/Head.png');
    app.loader.add('Apple', 'image/Apple.png');

    app.loader.load((loader, resources) => {

        for (let i = 0; i < SnakeSize; i++) {
            if (i > 0){
                const SnakeScale = new PIXI.Sprite(resources.SnakeScale.texture);
                SnakeScale.anchor.set(0.5);
                SnakeScale.scale.x = SnakeScale.scale.x / 2;
                SnakeScale.scale.y = SnakeScale.scale.y / 2;
                Snake.addChild(SnakeScale);
            } 
            else {
                const Head = new PIXI.Sprite(resources.Head.texture);
                Head.anchor.set(0.5);
                Head.scale.x = Head.scale.x / 2;
                Head.scale.y = Head.scale.y / 2;
                Head.angle = 90;
                Snake.addChild(Head);
            }
        }

        const Apple = new PIXI.Sprite(resources.Apple.texture);
        Apple.anchor.set(0.5);
        Apple.scale.set(0.13);
        app.stage.addChild(Apple); 

        Snake.x = 0;
        Snake.y = 0;

        StartGame();

        ScoreBoard.x = 700;
        ScoreBoard.y = 50;
    
        HighScore.x = 700;
        HighScore.y = 150;

        app.stage.addChild(ScoreBoard);
        app.stage.addChild(HighScore);

        const GameOverText = new PIXI.Text('            Game Over \n \n Press ENTER To Restart');
        GameOverText.anchor.set(0.7);
        GameOverText.x = app.screen.width/2;
        GameOverText.y = app.screen.height/2;
        GameOverText.visible = false;

        app.stage.addChild(GameOverText);

        const Keybinds = new PIXI.Text('Restart: \nENTER\n \nPause: \nSPACE');
        Keybinds.x = 700;
        Keybinds.y = 420;

        app.stage.addChild(Keybinds);

        app.ticker.add((delta) => {
            if(!Paused && !GameOver){
                GameOverText.visible = false;
                if(LastFrameTilelist[0] != null){
                    //GameOver State
                    if(LastFrameTilelist[0].x > 17 || LastFrameTilelist[0].x < 1 || LastFrameTilelist[0].y > 15 || LastFrameTilelist[0].y < 1 || Contains(LastFrameTilelist, GetTile(Snake.getChildAt(0).position.x, Snake.getChildAt(0).position.y))){
                        GameOver = true;
                        GameOverText.visible = true

                        if(Score > HScore){
                            HScore = Score;
                            HighScore.text = "  High \n Score: \n    " + String(HScore);
                        }

                        /*fs.writeFile('./Leaderboard.txt', '\n' + Score, (error) => { //No matter what I tried cant get fs to work.
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('File created successfully');
                            }
                          });*/

                    }

                    if(LastFrameTilelist[0].x == AppleTile.x && LastFrameTilelist[0].y == AppleTile.y)
                    {
                        //Create a new Apple
                        AppleTile = new Vec2d(Math.floor(Math.random() * (17 - 1) + 1), Math.floor(Math.random() * (15 - 1) + 1));
                        Score += 1;
                        Apple.position.set(GetTilePosition(AppleTile.x, AppleTile.y).x, GetTilePosition(AppleTile.x, AppleTile.y).y);
                        
                        //Add a new body piece to the snake
                        const SnakeScale = new PIXI.Sprite(resources.SnakeScale.texture);
                        SnakeScale.anchor.set(0.5);
                        SnakeScale.position.set(-100, -100);
                        SnakeScale.scale.x = SnakeScale.scale.x / 2;
                        SnakeScale.scale.y = SnakeScale.scale.y / 2;
                        Snake.addChild(SnakeScale);

                        ScoreBoard.text = "Score: \n    " + String(Score);
                    }

                    counter += delta;
                    if(counter >= 1){
                        //Move the Snake
                        if(Snake.getChildAt(0).position.x == GetTileCordinates(Snake.getChildAt(0).position.x, Snake.getChildAt(0).position.y).x && Snake.getChildAt(0).position.y == GetTileCordinates(Snake.getChildAt(0).position.x, Snake.getChildAt(0).position.y).y){
                            dirx = Direction.x;
                            diry = Direction.y;
                        }

                            Snake.getChildAt(0).x += dirx;
                            Snake.getChildAt(0).y += diry;

                        for(let i = 1; i < Snake.children.length; i++){
                            if(GetTile(Snake.getChildAt(0).x, Snake.getChildAt(0).y).x != LastFrameTilelist[0].x || GetTile(Snake.getChildAt(0).x, Snake.getChildAt(0).y).y != LastFrameTilelist[0].y){
                                Snake.getChildAt(i).position.x = GetTilePosition(LastFrameTilelist[i - 1].x, LastFrameTilelist[i - 1].y).x;
                                Snake.getChildAt(i).position.y = GetTilePosition(LastFrameTilelist[i - 1].x, LastFrameTilelist[i - 1].y).y;
                            }
                        }
                    

                        LastFrameTilelist = [];
                        //Save Snake position of this frame
                        for(let i = 0; i < Snake.children.length; i++){
                            LastFrameTilelist.push(GetTile(Snake.getChildAt(i).position.x, Snake.getChildAt(i).position.y));
                        }
                        counter = 0;
                    }
                }
            }
        });
    });
    app.stage.addChild(Snake);
};

app.loader.onError.add((error) => console.error(error));