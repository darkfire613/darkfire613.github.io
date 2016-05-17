---
layout: post
title: 'Game Development with Love2D: Part 2'
---
Welcome back! In the [first tutorial]({{ site.url }}/2016/05/16/love-tutorial-1.html), we got Love set up and ready to use to make games. In this second tutorial, we're going to create a separate object for the player, and look at how to handle keyboard input to move the player around. We'll also learn the theory behind Lua tables, as well as why delta time works.

## Making the player
Currently, our player variable is simply the image we're using to draw it on the screen. It contains no other useful data that a player entity in a game world might need, like location, equipment, or health. Let's change that. Go ahead and add a new file to your directory, named `player.lua`, and open it up in your text editor.

It is very useful, when creating a large project, to split your code up into multiple files with logical grouping. The most immediate benefit is being able to quickly find where the code you need to modify is located. If there's a bug with your player's movement, for example, it's much easier to look for the movement function in the player file than it is to scroll through potentially many thousands of lines in your main file looking for that same function. In the long term, a second benefit is portability. Say you write a useful module for your current game that does something like animating a sprite sheet. Two years later, you start making another game that also requires animation. Instead of writing a new animation module from scratch, you can simply copy the file from your old project, and it's ready to go!

(Incidentally, I did indeed create my own animation module for Love called [Animat](https://github.com/darkfire613/animat). It's on GitHub under the MIT license, so if any of it seems useful to you, feel free to grab and use it! In a later tutorial, we'll be walking through creating your own animation module as well, to better understand the theory behind it.)

Add the following code to your player file. Afterward, we'll go line-by-line again, and explain the theory.

```lua
local player = {}

function player:setup()
  self.img  = love.graphics.newImage('player.png')
  self.x    = 100
  self.y    = 100
end

return player
```

It should be pretty clear what every line here does. The first line creates an empty Lua table (for more explanation, see "Lua tables" below) to represent the player. Then, the setup function puts the same data we used before into the player object itself. The last line returns the player table, so it can be accessed from other files, like we'll be doing in our main file shortly.

Note the colon syntax in the method signature, and the use of `self` inside the method. The colon is simply syntactic sugar for telling the function to pass in the object it's called on--basically a workaround for member functions. Inside the function, this object is referred to as `self`. This allows you to easily write generic functions that can be used on multiple instances of an object. If there were two players, `p1` and `p2`, for example, calling `p1:setup()` would complete these setup tasks on only the p1 table. For more information, I highly recommend reading [chapter 16 of the Lua reference manual](https://www.lua.org/pil/16.html), which talks about how to use Lua in an object-oriented manner.

If you're coming from a more strictly object-oriented language like C++ or Java, it's important to note here that *Lua does not have access modifiers.* Indeed, while you can easily work in an object-like manner in Lua (as we'll be doing), it is not designed to be an object-oriented language. As such, all data in a Lua table is public, and can be accessed and modified anywhere in your program. On the bright side, you won't need to worry about creating setters and getters for every game entity. Instead, you can easily access your player's data with familiar dot syntax: `player.x`, for example, will return the value stored in the `x` entry for the player.

## Lua tables
I mentioned above that the line `local player = {}` creates an empty Lua table for the player. Tables are vital to understand for Lua development, as they are the *only* data structure present in the language. A Lua table is the same thing as an associative array in other languages. Basically, it is a collection of (key, value) pairs. In the player, for example, the key `img` returns the value of the image we loaded to represent the player. The x and y keys contain the x and y position values, respectively. These are basically member variables in an object-oriented language.

Tables are incredibly flexible, and Lua contains a number of built in functions for using tables like stacks, queues, maps, and other data structures. A table's size is mutable at runtime, and can contain arbitrary data as well as indexed data. Indexed data is accessed with `table[index]` syntax, and is, by default, 1-indexed (that is, the first index will be 1 by default, unlike standard programming convention where arrays are 0 indexed), although you can 0-index as well, if you like.

Lua also contains special `for` loops for looping through the data contained in a table. The syntax for these loops is as follows:

```lua
-- loop key/value pairs in a table
test1 = {x = 50, y = 80, z = 43}

for key, value in pairs(test1) do
-- prints each key and value in the table. Note there is no guarantee of order.
  print(key .. ',' .. value)
end

test2 = {5,6,7,8,9}

for index, value in ipairs(test2) do
-- prints each index and value. Note these print in indexed order.
  print(index .. ',' .. value)
end
```

The output of these two functions would be as follows (again, note the output for the first table could be in any order):
```
y,80
x,50
z,43

1,5
2,6
3,7
4,8
5,9
```

There is a lot more power hiding in tables, which we'll get to in later tutorials, namely in how to create prototypes and inherit methods and data from other tables. But for now, we simply need to know that a table is a collection of data, and is the fundamental building block of Lua.

## Get moving!
Back in the main function, we need to make just a couple modifications to get our game running again. Update main.lua to read as follows:

```lua
local Player = require "player"

function love.load()
  Player:setup()
end

function love.update(dt)

end

function love.draw()
  love.graphics.draw(Player.img, Player.x, Player.y)
end
```

At the top, we use a `require` statement to include the player file in the main file. Remember the return statement at the bottom of Player? That's the bit that assigns the Player variable in main to the table we made in player.lua.

In the load function, we now call the setup() function we defined in the player, which will load the player sprite and set its location to 100, 100. Finally, in the draw() function, we use dot syntax to call the `img`, `x`, and `y` fields in the player table. If we run the game again now, it should look exactly the same as before, but now we've grouped all of the data about the player together in one separate file, which will make adding additional features much easier.

Now it's time to get the player moving! The first thing we need to do is pick a speed for the player. This will be the speed in pixels per second that the player will move across the screen. In your player.lua file, right under `local player = {}`, add a new line: `SPEED = 100`. By default, all variables in Lua are global, so we'll be able to reference this variable back in main.lua. The all-caps variable name is simply convention indicating this is a constant value.

We'll start with just moving the player left and right. Up and down movement will be very similar, but I leave that as an exercise to you. Change the love.update() function to read as follows:

```lua
function love.update(dt)
  if love.keyboard.isDown('a') then
    Player.x = Player.x - (SPEED * dt)
  end

  if love.keyboard.isDown('d') then
    Player.x = Player.x + (SPEED * dt)
  end
end
```

If you run your game again, you should see the player move left and right when you press the keys! That's all for this tutorial; in part 3, we'll be streamlining our movement code to make it more modular, and easily extensible when we want to add more possible player actions. For people who have experience with callback functions or closures, that's where we're headed.

<video width="600" height="450" autoplay loop>
  <source src="{{ site.url }}/assets/love-tutorial/tutorial_vid1.mov">
  Your browser does not support html5 video.
</video>

The last section of this tutorial is just an explanation of why we use delta time in the movement function above. If you understand that already, or just don't care, feel free to skip it, otherwise read on!

## How delta time works
If you've already got an understanding of how this works, or if you don't really care about the theory and just want to write a game, feel free to skip this section. For anybody who's curious to learn how and why this works, read on.

Consider the following snippet of code used to move the player right:

```lua
SPEED = 50

love.update(dt)
  Player.x = Player.x + (SPEED * dt)
end
```

As mentioned previously, `dt` is short for delta time, which is the the elapsed time since the last time the update function was called, in seconds. Because modern processors run very quickly, this is usually a very small fraction of a second. For the sake of explanation, let's assume your game is running at a fixed 60 frames per second. This would mean that each frame of your game is 1/60 of a second, or ~.0167 seconds per frame.

Say then that we want our player to move at a rate of 50 pixels per second. We know one frame is 1/60 of a second, so we take 50 pixels/1 second * 1 second/60 frames, and get ~.833 pixels per frame. We write our function as follows:

```lua
SPEED = .833

love.update(dt)
  Player.x = Player.x + SPEED
end
```

Life is good, right? Now say we add a fancy particle system to our game. Whenever the player hits a wall, a giant cloud of sparks shoots out. The effect looks awesome, but for the time it's on the screen, our frame rate tanks to 20 fps. All of a sudden, as long as this effect is playing on screen, our player is not moving at 50 pixels a frame, but 16 or so instead!

Enter delta time, and that first function we wrote up at the top of this section. In that function, we set `SPEED = 50` right off the bat, since we know we want the player to move 50 pixels every frame. Then, every time the update function is called, we effectively do the math that we did manually before, multiplying the desired constant speed by the current frame time. Every frame, it will move the player a distance proportional to how long that frame took to calculate, resulting in a consistent movement of the player over time.

Remarkably, this is something that a surprisingly high number of developers neglect. When Dark Souls II first came out, for example, the amount of durability reduction was calculated by how many frames the weapon was intersecting with an enemy model. The game was designed to run at 30 fps, which meant that when the frame rate was boosted to 60 fps on PC, weapons would break twice as fast.
