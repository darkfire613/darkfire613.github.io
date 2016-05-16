---
layout: post
title: 'Game Development with Love2D: Part 1'
---

Recently, I've been playing with the [love2d](http://love2d.org) framework for 2d games, and I've found it truly delightful to use. However, the biggest sticking point I had was the lack of good tutorials that cover how to get started while also teaching good game development practices, which is what this tutorial series aims to tackle. Today we're going to be starting with getting set up to develop with Love, and drawing your first sprite to the screen.

Before we begin, a couple notes: I'm developing with Mac OS X, so while the procedure is probably similar with Linux, it's likely very different on Windows. Secondly, this tutorial assumes some programming knowledge already. You don't need to be fluent in Lua, but knowing at least one language, as well as working knowledge of bash, will be useful. A great reference is this series on [Lua for Programmers](http://nova-fusion.com/2012/08/27/lua-for-programmers-part-1/).

## Setting up for easy development on OS X

When you first download the Love runtime from the website, you might feel a bit lost. The easiest way to use it, I've found, is to add an alias to your bash profile to run your current project.

Type `vim ~/.bash_profile` to open up your bash profile, and then add an alias pointing to the Love executable (for those without vim experience, move the cursor to a fresh line and press "i" to enter insert mode). On OS X, the line should look something like this: `alias love="/Applications/love.app/Contents/MacOS/love"` but it will vary depending on where you've placed the executable. Once that's added press`esc` to exit insert, then `shift+:` to go to the command bar and type `wq!` to save and quit vim.

Now that you've added this shortcut, you can easily test your game directly from the command line. As long as you're in your game's working directory (the one with your `main.lua` file) you'll be able to type `love ./` to run your game.

## Configure your window

Now that we have this easy alias for testing, it's time to get started writing your actual game. Create two new files, one named `main.lua` and one named `conf.lua`. Love will load configuration information from conf.lua automatically, and then execute your code in main.lua. Open these up in a text editor of your choice (I love [Atom](https://atom.io), for which you will want to download the [language-lua](https://atom.io/packages/language-lua) package for proper syntax highlighting), and we'll start with conf.lua.

We don't need to add much to this file (at this stage, we really don't need to add anything but it will be very useful later on to change parameters about your game). Add the following code to the file:

```lua
function love.conf(t)
  t.window.width = 800
  t.window.height = 600
  t.window.title = 'Love Tutorial'

  t.version = '0.10.1'
end
```

The config file is used for setting a bunch of parameters about your game. A complete list of the possibilities is [here](https://love2d.org/wiki/Config_Files) on the love wiki, but for now I'll just explain the parts of it that we're using:

* The first line, `function love.conf(t)` is how you declare a function in Lua. The name of the function, love.conf, indicates that the function is named conf and is part of the love package. In this case, we're overriding a default function in Love with our own values. The argument in the parentheses, t, is a reference to the game itself, passed in automatically by Love.

* The next three lines set the width, height, and title of the game window.

* The next line specifies which version of Love your game is compatible with. Here we've chosen Love v0.10.1, which is the most current version.

* Since Lua does not use brackets or semicolons, all functions and other blocks such as loops finish with `end`.

## Get started with the game

The most important concept with structuring your game is understanding how Love's callback functions work. A callback is a function that is passed as an *argument* to another function. In Love, the callback functions are all passed into `love.run` and executed at the proper time in the game loop. The actual process of creating the game loop is handled by Love, but it is up to you to define what functionality your game will actually have, by providing your own definitions for these functions.

(If you want to know more about what's happening behind the scenes, I definitely recommend reading [this chapter](http://gameprogrammingpatterns.com/game-loop.html) from the absolutely excellent book [*Game Programming Patterns*](http://gameprogrammingpatterns.com) by Robert Nystrom. Every aspiring game developer should read this book. Although it's mainly written for game development with a focus on C++, the theory behind it on writing code that is easy to modify and expand is incredibly useful regardless of what you're developing, or which language you prefer.)

A complete list of these callback functions can be found [here](https://love2d.org/wiki/Category:Callbacks), but for now there are three that are the most important:

* `love.load()` runs when your game is first opened up, and should include the code required to get your game set up for play.

* `love.update(dt)` runs every tick, and is used to update the state of your game, such as moving entities and checking for collisions. `dt`, short for delta time, is passed into the function, and is the time in seconds since the last time the update function was called. This is very useful for ensuring things in your game progress at a constant speed regardless of frame rate, as we'll see in the next tutorial when we begin moving objects around.

* `love.draw()` also runs every tick, and is where you will put your code that actually makes sprites appear on the screen. This is where we will be doing most of our work today.

We'll go ahead and add these three functions to main.lua:

```lua
function love.load()

end

function love.update(dt)

end

function love.draw()

end
```

if we run our game now (with `love ./` if you added the bash alias above), we should see an empty screen:

![Love Tutorial: Empty Screen]({{ site.url }}/assets/love-tutorial/screenshot-1.png)

Doesn't look like much yet, but this is the blank canvas for the whole rest of our game. Let's make it a little bit more interesting.

Add a folder to your project directory called `assets` and use any image editing software to add a small picture to it named `player.png`. In my case, I used a 32x32 pixel blue square. Now, modify the load and draw functions as follows:

```lua
function love.load()
  player = love.graphics.newImage('assets/player.png')
end
```
```lua
function love.draw()
  love.graphics.draw(player, 100, 100)
end
```

The first function call returns an image at the specified file path, and we put that image in the `player` variable. The second function takes three arguments, an image, an X position, and a Y position, and draws the image at the specified location. Note that, counter to how we all learned X and Y coordinates in algebra, computer graphics have their (0,0) origin at the upper-left corner, with the Y-axis running down. Thus, this will draw the player image at a spot 100 pixels in from the top and left edge, like so:

![Love Tutorial: Player Drawn]({{ site.url }}/assets/love-tutorial/screenshot-2.png)

We've now got the basic framework for our game set up, and have learned how to draw an image on the screen! In the next tutorial, coming in a couple days or so, we'll look at creating our first object for the player, and how to handle input from the keyboard. Stay tuned!
