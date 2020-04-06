# project-one-underground-combat
A combat simulation after the style of one of my favorite games

## Controls
Use arrow keys to move your SOUL and to switch between various lists and buttons. If something is currently selected, it will appear Yellow. Press Space to select the currently highlighted options. If you are on either the item or monster selection screens, press Escape to return to the main menu.

There are two ways to win: either kill the monster outright or befriend it and show mercy. Both paths are available for all encounters.

This game is turn-based. The first turn always goes to you, the player, where you choose what you wish to do. When you've completed your turn, you enter SOUL mode, where your Soul is represented by a red heart inside of a white box. The monster will then then throw attacks to try to damage your SOUL, which you must move to avoid. Different monsters have different attacks, and will require different strategies to avoid.

## Technologies and Resources used
The core concept of the game is derived from the game Undertale by Toby Fox, and all the sprites used come from the game as well.

This game was built using the Phaser 3 framework developed by Photon Storm Ltd. I learned virtually everything I needed using examples and tutorials provided by the Phaser 3 team as well as a codealong tutorial by Lyubomira Popova called "How to create a turn-based RPG in Phaser 3" which gave me a much more in-depth understanding of the Phaser 3 framework.

The sprites I pulled from The Spriters Resource, I pulled out the sprites I needed with Lunapic, and compiled a new spritesheet and accompanying atlas using the Atlas Packer tool by GAMMAFP.

## Remaining bugs
When selecting items, occasionally the scene will move two at once. Thankfully, it has yet to give the player more than their maximum of 3 items. In addition, one bit of functionality I wanted to implement but did not get the chance was to keep the two lists of items ordered by functionality, i.e. the weapons with weapons and food with food, because as it stands items are simply spliced and pushed with nothing done in terms of organizing.