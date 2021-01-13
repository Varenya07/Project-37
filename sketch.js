var dog,happyDog,dog_pic;
var foodstock, foodS;
var database;
var feedPet,addFood;
var feedTime,lastFed;
var food;
var gameState;
var washroomPic,bedroomPic,gardenPic;
//var sadDog;
var currentTime;

function preload()
{
  dog_pic = loadImage("images/dogImg.png")
  happyDog = loadImage("images/dogImg1.png")
  washroomPic = loadImage("images/Wash Room.png")
  bedroomPic = loadImage("images/Bed Room.png")
  gardenPic = loadImage("images/Garden.png")
  //sadDog = loadImage("images/deadDog.png")
}

function setup() {
database = firebase.database();

 var canvas = createCanvas(1000, 800);
  
  dog = createSprite(800,300,20,20);
  dog.addImage(dog_pic)
  dog.scale = 0.15;

  foodstock = database.ref('Food');
  foodstock.on("value", readStock)

  food = new Food();

  feedPet = createButton("Feed the dog")
  feedPet.position(700,95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Food")
  addFood.position(800,95)
  addFood.mousePressed(AddFood);
  
  textSize(18)
}


function draw() {  

  background(46,139,87);   

  food.display();

  currentTime = hour();

  if(currentTime === (lastFed+1)) {
    update("Playing");
    food.garden();
  }
  else if(currentTime === (lastFed+2)) {
    update("Sleeping");
    food.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<(lastFed+4)) {
    update("Bathing");
    food.washroom();
  }
  else{
    update("Hungry");
    food.display();
  }

  feedTime = database.ref('feedTime');
  feedTime.on("value", function(data) {
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12) {
    text("Last Feed: " + lastFed%12 + "PM", 350,30);
  }
  else if(lastFed===0) {
    text("Last Feed: 12 AM",350,30)
  }
  else{
    text("Last Feed: " + lastFed + "AM",350,30)
  }

  if(gameState!=="Hungry") {
    feedPet.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feedPet.show();
    addFood.show();
    dog.addImage(dog_pic);
  }

  


  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  food.updateFoodStock(foodS)
}

function AddFood() {
  foodS++

  database.ref('/').update({
    Food: foodS
  })}

  function feedDog() {
    dog.addImage(happyDog);


    food.updateFoodStock(food.getFoodStock()-1);

    database.ref('/').update({
      Food: food.getFoodStock(),
      feedTime: hour()
    })
  }
  
  var gameStateRef = firebase.database().ref('gameState');
  gameStateRef.on("value", function(data) {
    gameState = data.val();
  })

  function update(state) {
    database.ref('/').update({
      gameState: state 
    })
}


  



