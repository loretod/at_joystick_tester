// initialize context
kaboom({
  background: [255, 250, 205],
});

setGravity(0)

// load assets
loadSound("score", "sounds/score.mp3");
loadSound("click", "sounds/click.mp3")
loadSprite("apple", "sprites/apple.png");
loadSprite("coconut", "sprites/coconut.png");

loadSpriteAtlas("sprites/tileset.png", {
  "player": {
    "x": 128,
    "y": 0,
    "width": 144,
    "height": 32,
    "sliceX": 9,
    "anims": {
      "idle": {
        "from": 0,
        "to": 6,
        "speed": 3,
        "loop": true,
      },
      "run": {
        "from": 4,
        "to": 7,
        "speed": 10,
        "loop": true,
      },
      "hit": 8,
    },
  },
  "button": {
    "x": 18,
    "y": 212,
    "width": 60,
    "height": 25,
    "sliceX": 4,
    "anims": {
      "red": {
        "from": 0,
        "to": 1,
        "speed": 3,
        "loop": false,
        "pingpong": true,
      },
      "blue": {
        "from": 2,
        "to": 3,
        "speed": 10,
        "loop": false,
      },
    },
  },
  "slug": {
    "x": 370,
    "y": 373,
    "width": 56,
    "height": 25,
    "sliceX": 4,
    "anims": {
      "idle": {
        "from": 0,
        "to": 3,
        "speed": 1,
        "loop": true,
        //"pingpong": true,
      },
    }
  }
});

loadSpriteAtlas("sprites/character.png", {
  "target": {
    "x": 2,
    "y": 1,
    "width": 32,
    "height": 16,
    "sliceX": 15,
    "anims": {
      "brown": {
        "from": 0,
        "to": 2,
        "speed": 3,
        "loop": true,
      },
    },
  },
})

// Custom functions

//function to add a button
function addButton(txt, w, h, p, f) {

  // add a parent background object
  const btn = add([
    rect(w, h, { radius: 8 }),
    pos(p),
    area(),
    scale(1),
    anchor("center"),
    outline(4),
  ])

  // add a child object that displays the text
  btn.add([
    text(txt),
    anchor("center"),
    color(0, 0, 0),
  ])

  // onHoverUpdate() comes from area() component
  // it runs every frame when the object is being hovered
  btn.onHoverUpdate(() => {
    const t = time() * 10
    btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7)
    btn.scale = vec2(1.2)
    setCursor("pointer")
  })

  // onHoverEnd() comes from area() component
  // it runs once when the object stopped being hovered
  btn.onHoverEnd(() => {
    btn.scale = vec2(1)
    btn.color = rgb()
  })

  "txt"

  // onClick() comes from area() component
  // it runs once when the object is clicked
  btn.onClick(f)

  return btn
}

//function to load the targets on the screen
function loadTargets(n) {

  var x = [100, width() / 2, width() - 100]
  var y = [100, height() / 2, height() - 200]

  for (var j = 0; j < y.length; j++) {
    for (var i = 0; i < y.length; i++)
      add([
        sprite(n),
        pos(x[i], y[j]),
        area(),
        scale(5),
        anchor("center"),
        "target",
      ])
  };
}

function loadInstructions(t){
  const frame = add([
    rect(width()/2,height()/3),
    outline(5),
    anchor("center"),
    pos(center()),
    lifespan(4, { fade: .05 }),
    color(rgb(102,102,102)),
    z(2),
  ])

  const instruct = add([
    text("Move to catch all the " + t + " on the screen. Then click the buttons to test them out.",{
      width: width()/2.5
    }),
    pos(center()),
    anchor("center"),
    lifespan(4, { fade: .05 }),
    color(rgb(211, 226, 241)),
    z(3),
  ])
};


//Starting scene
scene("start", () => {
  add([
    text("What would you like to test?",{
      size: 60,
    }),
    pos(width() / 2, height()/4),
    color(rgb(102, 102, 102)),
    anchor("center")
  ]);

  addButton("Mouse", 300, 75, vec2(width()/2 + 200, height()/2), () => go("mouse"))
  addButton("Gamepad", 300, 75, vec2(width()/2- 200, height()/2), () => go("gamepad"))

})

//Mouse check scene
scene("mouse", () => {
  // load assets
  setBackground(0, 0, 100, .2);
  loadInstructions("apples")

  //Generate targets on the screen
  loadTargets("apple");

  //load the player
  const player = add([
    sprite("player"),
    pos(rand(vec2(width(),height()))),
    anchor("center"),
    area(),
    scale(5),
    z(1),
    body(),
    "player"
  ]);
  player.play("run")

  //load the assets
  const base = add([
    rect(width(), 140),
    pos(0, height()),
    area(),
    anchor("botleft"),
    outline(4),
    color(rgb(229, 148, 146)),
    z(-1),
  ])

  addButton("Back", 150, 50, vec2(150, height() - 50), () => go("start"))

  const button_label = add([
    text("Button pressed: "),
    pos(width() / 2, height()-50),
    z(1),
    anchor("left"),
    color(rgb(211, 226, 241))
  ])

  const nucleus = add([
    pos(100, height() / 4),
    anchor("center"),
  ])

  x = [width() / 3, width() / 2, width() / 1.5]
  // Add children
  for (let i = 0; i < 3; i++) {

    nucleus.add([
      sprite("button", { anim: "red" }),
      rotate(0),
      body({ isStatic: true }),
      anchor("center"),
      area(),
      pos(x[i], height() / 1.5),
      scale(5),
    ])
  }

  //have the mouse follow the mouse position and remove the cursor
  player.onUpdate(() => {
    player.pos = mousePos();
    setCursor("none");
    //what happens when the buttons are clicked
    if (isMousePressed("left")) {
      button_label.text += "Left"
      wait(1, () => {
		    button_label.text = "Button pressed:"
	    })
      player.play("run")
      play("click")
      nucleus.children[0].play("red")
    }
    if (isMousePressed("right")) {
      button_label.text += "Right"
      wait(1, () => {
		    button_label.text = "Button pressed:"
	    })
      play("click")
      nucleus.children[2].play("red")
    }
    if (isMousePressed("middle")) {
      button_label.text += "Center"
      wait(1, () => {
		    button_label.text = "Button pressed:"
	    })
      play("click")
      nucleus.children[1].play("red")
    }
  });

  //what happens when the player touches the targets
  onCollide("target", "player", (target) => {
    play("score")
    destroy(target)
  })
});

scene("gamepad", () => {
  loadInstructions("coconuts")

  //A function that will load the player when a gamepad is detected by the browser
  function addPlayer(gamepad) {
    const player = add([
      pos(rand(vec2(width(),height()))),
      anchor("center"),
      sprite("player"),
      area(),
      scale(5),
      z(1),
      "player"
    ])

    onUpdate(() => {
      //get the instance of the left joystick
      const leftStick = gamepad.getStick("left")

      //what happens with the buttons are pressed
      if (gamepad.isPressed("south")) {
        play("click")
        nucleus.children[0].play("blue")
        button_label.text += "1"
        wait(1, () => {
		      button_label.text = "Button pressed: "
	      })
      }

       if (gamepad.isPressed("east")) {
        play("click")
        nucleus.children[1].play("blue")
        button_label.text += "2"
        wait(1, () => {
		      button_label.text = "Button pressed:"
	      })
      }

      if (gamepad.isPressed("west")) {
        play("click")
        nucleus.children[2].play("blue")
        button_label.text += "3"
        wait(1, () => {
		      button_label.text = "Button pressed: "
	      })
      }

      //move the player when joystick is moved
      if (leftStick.x !== 0) {
        player.move(leftStick.x * 400, 0)
        player.play("run")
      }

      if (leftStick.y.toFixed !== 0) {
        player.move(0, leftStick.y * 400)
        player.play("run")
      }
    })
  }

  // load assets
  setBackground(rgb(242, 209, 82));
  const instructions = add([
    text("Connect a joystick to get started!"),
    pos(height()/2, width() / 3),
    color(rgb(102, 102, 102)),
    anchor("center"),
  ]);

  //Generate targets on the screen
  loadTargets("coconut");

  //load the other game assets
  const base = add([
    rect(width(), 140),
    pos(0, height()),
    area(),
    anchor("botleft"),
    body({isStatic: true}),
    outline(4),
    color(rgb(102, 102, 102)),
    z(-1),
  ])

  const button_label = add([
    text("Button pressed: "),
    pos(width() / 2, height()-50),
    z(1),
    anchor("left"),
    color(rgb(211, 226, 241))
  ])

  const nucleus = add([
    pos(100, height() / 4),
    anchor("center"),
  ])

  x = [width() / 3, width() / 2, width() / 1.5]
  // Add children
  for (let i = 0; i < 3; i++) {

    nucleus.add([
      sprite("button", { anim: "blue" }),
      rotate(0),
      body({ isStatic: true }),
      anchor("center"),
      area(),
      pos(x[i], height() / 1.5),
      scale(5),
    ])
  }

  //what happens with the player and target touch
  onCollide("target", "player", (target) => {
    play("score")
    destroy(target)
  })

  //what to do when the gamepad is detected
  onGamepadConnect((gamepad) => {
    addPlayer(gamepad)
    destroy(instructions)
  })

  addButton("Back", 150, 50, vec2(100, height() - 70), () => go("start"))

});

//start the whole thing!
go("start")
