---
layout: post
title: CrowdGo&#58; my latest project
---
Recently I've been working on a web application called CrowdGo. Basically, it's a way for people to play the ancient strategy board game Go online with other people, but with a twist: everyone is playing on the same board. The project's currently deployable state can be seen [here](/crowdgo/), and the GitHub repository can be found [here](https://github.com/darkfire613/crowdgo/). Currently it doesn't do much. Even the basic game logic isn't implemented. All you can do right now is click to place stones on the board. But if you're interested in more in-depth explanation of the future of this project, read on.

All the connected players see the same board in its current state. The board's state is kept on the server and pushed to the client. The draw code is on the client side and is executed at every update. The server is running on [Express](http://expressjs.com) which is build on [Node.js](http://nodejs.org), using [Socket.io](http://socket.io) for real-time updating. Please note that none of the netcode has been written at this moment. The GitHub repo represents all the current progress on the game. All of the below is thus supplied not as a promise of future features or a guarantee of functionality. It is simply an outline of my intentions for the project. I have a penchant for leaving projects unfinished.

On connecting to the game, the client will be assigned to one of the teams, based on whose turn it currently is, with some balancing to ensure teams don't get too unbalanced. The game will try to keep the number of players on each time within +-5% of each other. The player's team gets stored locally, along with the number of the current game, so they can't refresh the page to get assigned a new team. On connect, if the stored game number matches the current game number, they get assigned to the same team as they were before. Otherwise, it means the old game is over, and they are reassigned as described above.

On a team's turn, anyone on that team can click to play a stone. The first person to click gets their stone played, all other inputs are thus disregarded. On click, the client sends to the server the coordinates of their click, processed so they align to the grid (the method for this is outlined below). The server responds by pushing these coordinates to all clients, along with a draw event for them to draw the stone at these coordinates.

The server handles game logic. Checking groups for open liberties, etc. This is executed once per turn. Each team also has a skip button to end the game. When both teams have clicked the skip button, the game ends, and the winner is decided by Japanese rules (score is territory - captured stones). The winner is logged in a game logs file, which is used to update a pie chart somewhere on the page of which team has won more. Then a new game begins.

### Coordinate Alignment to Grid

All this code is visible on the GitHub repo as well, but since that will be added to and modified, I've pasted the relevant code below.

When the player clicks on the board to play a stone, we're able to get the x and y coordinates. However, these coordinates can be anywhere on the canvas, which isn't useful for drawing the Go stones, since we want the stones aligned to the grid. Instead, we handle this as follows:

{% highlight javascript %}

//Variable ADJUST THESE
var scale = 0.6;
var grid_size = 8;
var ref_line_width = 3;
var margin_factor = 0.25;

//Static DO NOT CHANGE
var REF_SQUARE = 100;
var SQUARE_SIZE = REF_SQUARE * scale;
var LINE_WIDTH = SQUARE_SIZE * (ref_line_width/REF_SQUARE);
var BOARD_MARGIN = SQUARE_SIZE * margin_factor;
var BOARD_SIZE = (SQUARE_SIZE * grid_size) + (BOARD_MARGIN * 2);

var x = //x click
var y = //y click

var i = (x - BOARD_MARGIN) / SQUARE_SIZE;
var j = (y - BOARD_MARGIN) / SQUARE_SIZE;

i = Math.round(i);
j = Math.round(j);

var centerX = (SQUARE_SIZE / 4 ) + (i * SQUARE_SIZE);
var centerY = (SQUARE_SIZE / 4 ) + (j * SQUARE_SIZE);

{% endhighlight %}

**scale:** The amount the board should be scaled by. Decimal value between 0 and 1. This scales down the Reference which has grid squares of 100x100. In this example, the board is 60% reference size.

**grid_size:** The number of grid squares in each direction of the board. This should be one less than the number of intersections. In this case, it draws a 9x9 Go board.

**ref_line_width:** How wide, in px, the grid lines should be on the reference board. This is scaled down according to the scale factor.

**margin_factor:** How wide the margin (the board space around the grid) should be, in relation to the width of a grid square's size. Here, the margin is 25% of a grid square.

**REF_SQUARE:** Reference Square. A Reference Square is 100x100 pixels.

**SQUARE_SIZE:** The scaled squares. Product of the reference sqare and the scale.

**LINE_WIDTH:** The actual line width. Since the ref_line_width is in relation to a 100px square, it's divided by that amount then multiplied by the size of a scaled square, to keep its width in proportion with the new scale.

**BOARD_MARGIN:** The value, in px, of the actual margin. Margin factor by square size.

**BOARD_SIZE:** The length of one side of the board, which includes the grid and the margin. Is the sum of all the grid squares plus two margins, one for each side of the board.

The variables x and y are assigned to the x and y click positions. Note I did not add the complete code for this, since the method for getting that is irrelevant to this discussion.

Next, two more variables, i and j, are declared. Ultimately, these will store an integer value between 0 and n, where n is the number of squares in the grid. Thus, i and j align with the numerical value of the array index of the given intersection, (0,0) being top-left corner. These take their respective coordinate value, subtract the width of the margin, then divide by the size of a square. This has the effect of producing a decimal value that, when rounded, returns the integer value of the closest intersection.

Finally, two more variables, centerX and centerY, are produced. These reverse the conversion in the previous step. Since they occur after the values of i and j have been rounded, however, they store the coordinate positions of the intersection in the canvas element.

On first glance, this interconnecting system of variables seems unnecessary. However, what this allows for is flexibility. I can easily change the board to any other size (say, 19x19, as a standard Go board is) and it will grow and adapt without any extra modification beyond changing the value of grid_size. Likewise, if I find the board is too big or small to fit comfortably, I just need to adjust scale and all my numbers get scaled according to it. What seems like a nest of variables is actually an elegantly scalable implementation.

### What comes next?

My next step is implementing the basic server, which will allow everyone connected to see the current board state. Following that, I will begin to implement the game logic, allowing it to actually be played, rather than be simply a dot-drawing toy.

Feel free to fork, modify, and play with as you wish.
