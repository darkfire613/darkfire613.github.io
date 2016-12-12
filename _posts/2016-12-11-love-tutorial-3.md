---
layout: post
title: "Game Development with Love2D: Part 3"
---
Welcome back! It's been a while. Last time, we implemented some basic user input into our game, allowing the player to control the little blue square on screen with key inputs. In this tutorial, we're going to be creating an input handler that will act as an intermediary between our keyboard input and the actions our game takes in response.

This is desirable for a number of reasons. As projects get bigger, we often want to have loosely linked code. Hardcoding our input handling code into the love.update function may be fine when we only have a small number of actions, but as the project grows and we want to add more actions, this chunk of code is quickly going to become bloated. Additionally, we want a level of indirection between the key that's pressed and the action that it takes, to allow for things like user-customizable key commands.

Go ahead and create a new file called `inputHandler.lua`. We're going to create a new table for our input handler, then define a function for adding game behaviors to it:

```lua
local inputHandler = { actions = {} }

function inputHandler:addAction(key, command)
  self.actions[key] = command
end

return inputHandler
```

Our input handler now has its own table, called actions, that is, as always, a list of key-value pairs. In this situation, "key" is kind of an ambiguous term: the key to our table is *also* the key the user presses. Command, then, is a callback function, describing what should happen when a player presses that key.

## Callback Functions

People with a background in Javascript or other languages that can be used functionally should already know what a callback function is. Those with a strong OOP background might be familiar with the [Command design pattern](http://gameprogrammingpatterns.com/command.html) which is a way to replicate this behavior by wrapping a function inside an object. Essentially, a callback is a function that is *passed to another function as an argument*.  This lets you define some custom behavior that will be called by other code at the appropriate time.

In this instance, using callbacks lets us easily redefine the behavior of any keyboard key at any time we want. The beautiful thing here is, that command could be anything.

We're going to re-implement our wasd-movement behaviors using our new input handler instead. Change your love.load function to add the following four lines:

```lua
function love.load()
  Player:setup()

  Input:addAction('w', function(dt) Player.y = Player.y - (speed * dt) end)
  Input:addAction('a', function(dt) Player.x = Player.x - (speed * dt) end)
  Input:addAction('s', function(dt) Player.y = Player.y + (speed * dt) end)
  Input:addAction('d', function(dt) Player.x = Player.x + (speed * dt) end)
end
```

You can see that the four functions look the same as the lines we previously had in love.update. However, unlike the other functions we've worked with so far, something is different with these: they have no names! When we pass a function as a callback to another function, we can use what are called *anonymous functions* which are simply functions with no name. Anonymous functions are easy to write; they simply follow this pattern: `function(args) [code here] end`.

Now, we're going to change our update function to listen to all the keys that we have defined behaviors for, and to perform those actions when the key is pressed:

```lua
function love.update(dt)
  for key in pairs(Input.actions) do
    if love.keyboard.isDown(key) then
      Input.actions[key](dt)
    end
  end
end
```

The for loop will loop every key that we've added to our input actions. Then, if the key is being pressed, it calls that function. You have to be careful to always pass the parameters that your original function asked for; in this case, all four of our behaviors use the dt variable, so we're passing it as an argument.

If your run your game now, you'll notice that all the behaviors are exactly the same as before. However, we've decoupled our movement behaviors from the keys they correspond to, which will become very powerful as we go forward.

Now, a game isn't a game without some sort of goal, so in the next lesson we're going to look at adding more things to the game world to interact with, using shallow inheritance with Lua's [`__index` metamethod](https://www.lua.org/pil/13.4.1.html).

Check out the source code for this tutorial series [here](https://github.com/darkfire613/love-tutorials).
