---
layout: post
title: CrowdGo Update
---
Way back in September, I wrote a blog post talking about a project I was working on called CrowdGo. It was a way for me to learn how to build web applications using node.js, and also program a little game people could play together online. Well, I got sidetracked by school back then, but I've just returned to it, and I've made enough progress on it that I'm ready to call it version 0.1.0 alpha. Read on for my notes on how this went, and what still needs doing.

### Current Functionality

The biggest thing that I've accomplished is getting placed stones to propagate to all players. As I mentioned back in the [first post](http://owenmonsma.com/2014/09/21/crowdGo&%2358;-my-latest-project.html), I used socket.IO to handle this. All of the draw calls are handled by the server, with the client just handling the actual drawing. Basically, this is the way it works: When you click on the board, the location of your click is translated into the coordinates of the closest intersection, which is the center of the placed stone. This set of X/Y coordinates is sent to the server, which pushes them to every single player, along with which turn it currently is, black or white. All the clients receive this data, then draw the stones on the board.

### Future Updates

Yeah, the Current Functionality section is kind of lacking right now. But for me, getting the server communication working was the biggest unknown. I've broken down the next steps of development as follows:

 1. **Place colors according to team.** Right now, when a player connects to the server, they're assigned to a team, either black or white. However, this does not currently do anything, and is not even sent to the client. The next step is making your team affect which color of stone you can play.

 2. **Place stones only on your team.** This kind of goes hand in hand with step 1, but the player should only be able to place stones when it's their turn as well. This creates the basic game flow.

 3. **Storing the game board state.** The board as you see it right now does not actually represent any server-side data. The moves aren't stored anywhere, and the board has no knowledge of its current state. This means that you can place your stones over other people's stones right now and flip the color. Obviously this is not how it should be. The plan is to store the board's current state in a 2D array, and check if the move is valid or not. This is also the first step towards implementing game logic.

 4. **Implementing game logic.** The game needs to know when groups of stones are surrounded, in order to facilitate the actual play. Additionally, it needs to keep track of the current score and include a way for the game to end (my current thinking is a "pass turn" button that if both teams click it, the game ends).

 5. **Database to store historical data.** I would eventually also like to store data on team wins and score, and make some cool interactive charts to show it off. But that's a ways down the road.

### Concluding notes

I'm feeling really optimistic about the project. The next couple steps should be fairly easy to crank out over the next couple days. The game logic will probably take a while longer but thankfully I do have some idea of how to code the game logic for this thanks to an earlier project of mine.

[CLICK HERE TO PLAY CROWDGO 0.1.0A](https://salty-crag-7633.herokuapp.com/)
