<img src="https://i.imgur.com/oi5NwOp.png" alt="Lets Go"> </img>

## !afk

The AFK command kicks people from the world after the specified time in config.js if they are not paradox opped. The command acts as a toggle to enable and disable the module.

> ```Toggle
> !afk
> ```

## !allowgma

!> Note one mode has to stay enabled by default if all modes are not allowed, and this is Adventure.

This modules allows players to be in game mode adventure. All paradox Opped players are excluded from checks.

> ```Toggle
> !allowgma
> ```

## !allowgmc

!> Note one mode has to stay enabled by default if all modes are not allowed, and this is Adventure.

This modules allows players to be in game mode creative. All paradox Opped players are excluded from checks.

> ```Toggle
> !allowgmc
> ```

## !allowgms

!> Note one mode has to stay enabled by default if all modes are not allowed, and this is Adventure.

This modules allows players to be in game mode survival. All paradox Opped players are excluded from checks.

> ```Toggle
> !allowgms
> ```

## !antikb

This module monitors players for using possible hacks to prevent taking knockback it can be enabled and disabled via the command in chat.

> ```Toggle
> !antikb
> ```

## !antifalla

This module detects players using NoFall damage hacks if a player is detected they are flagged, this can be enabled or disabled by using the following command.

> ```Toggle
> !antifalla
> ```



## !antikillaura

This module monitors players and checks for attacks outside a 90 degree angle. This module can be enabled or disabled via the command below.

> ```Toggle
> !antikb
> ```

## !antinukera

This module prevents players from nuking the world, when detecting that a vast amount of blocks are being removed at an extreme rate it will flag the offending player and ban them.

> ```Toggle
> !antinukera
> ```

## !antiphasea

This modules checks for players using phase hacks, players who phasing through blocks, will be teleported back to the last valid location this acts as a deterrent to using the hack, players who are paradox opped will be alerted providing they have cheat notifications on.

> ```Toggle
> !antiphasea
> ```

## !antispam

This module checks players for spamming in chat, there is a 2 second cool down. If they are flagged more than five times they will be banned.

> ```Toggle
> !antispam
> ```

## !autoban

This module monitors all players current violations across every module in paradox if they have a violation count above 50, they will be banned, this runs every 5 minutes.

> ```Toggle
> !autoban
> ```

## !badpackets1

This module checks for message lengths with each broadcast. If a message is detected they are banned.

> ```Toggle
> !badpackets1
> ```

## !badpackets2

This module checks for invalid selected slots by player. If flagged the player is banned.

> ```Toggle
> !badpackets2
> ```

## !ban

This command allows you to ban a player, below is an example.

> ```Command
> !ban Pete9xi Was using hacks.
> ```

If a player has a space in their name you can wrap this in quotation marks

> ```Command
> !ban "Tin Man22" using fly hacks.
> ```

## !bedrockvalidate

This module checks for bedrock being removed at the bottom of the world, if missing it replaces the bedrock layer this module can be toggled via the command.

> ```Toggle
> !bedrockvalidate
> ```

## !biome

This command is usable by all players, when ran in chat it will print the current biome and the direction they are facing in chat, only the player that ran the command can see this.

> ```Command
> !biome
> ```

## !chatranks

Chat ranks are fully customizable and can be enabled or disabled using the command. When disabled chat will go back to the vanilla style.

> ```Command
> !chatranks
> ```

## !channel

?> The channel command can be used by all players.

The channel command has a few parameters that you can use, channels are private chat groups these can be protected by a password or left open so others can join, Players can also be invited to a chat channel when all members leave the chat channel or the server gets restarted the channels are deleted.

Example of creating a channel without a password.

> ```Command
> !channel create Test
> ```

Example of creating a chat channel with a password.

> ```Command
> !channel create Test Password123
> ```

Example of deleting an existing channel without a password.

> ```Command
> !channel delete Test
> ```

Example of deleting an existing channel with a password.

> ```Command
> !channel delete Test Password123
> ```

Example of inviting a player to the channel

> ```Command
> !channel invite Visual1mpact
> ```

Example of joining a channel without a password

> ```Command
> !channel join Test
> ```

Example of joining a password protected channel.

> ```Command
> !channel join Test Password123
> ```

You can also transfer ownership of a channel providing you are the one who created it, an example below.

> ```Command
> !channel handover Test Visual1mpact
> ```

## !clearchat

This command clears the chat window for all players, this can only be ran by paradox opped players

> ```Command
> !clearchat
> ```

## !clearlag

This module removes lag from the server, this can be configured in config.js as to the time intervals that it checks by default this is set to every 10 minutes. The module removes all entity that are considered lag ie dropped items etc.

> ```Toggle
> !clearlag
> ```

File: `scripts/data/config.js`

> ```js
> 		clearLag: {
            enabled: false,
            seconds: 0,
            minutes: 10,
            hours: 0,
            days: 0,
        },
> ```

File: `scripts/data/clearlag.js` 

This contains all items/entitys that are cleared from the world when the module is active.


## !credits
This command shows the credits which contains all members who have worked on paradox in the past as well as the current devlopers.

> ```Command
> !credits
> ```

## !deop

The deop command is used to Revokes Op from a player in Paradox AntiCheat features.

> ```Example
> !deop Pete9xi
> ```

## !delhome

?> The delhome command can be used by all players.

This command allows a player to delete one of their saved locations.

> ```Command
> !delhome MineTown
> ```

## !despawn

This command allows you to despawn multiple entitys in the loaded chuncks around you, below is an example of removing all zombies from around the player.

> ```Command
> !despawn zombie
> ```

If you want to remove all entites around you in the current loaded chunks you can run the following command.

> ```Command
> !despawn all
> ```


## !ecwipe

This command allows you to wipe a players enderchest inventory, you can run the following command.

> ```Command
> !ecwipe Pete9xi
> ```


## !enchantedarmor

This module when enabled prevents players from wearing enchanted armor.

> ```Toggle
> !enchantedarmor
> ```

## !fly

!> The EDU flag must be enabled on the world for this command to be used.

This command grants a player fly abilities.

> ```Command
> !fly Pete9xi
> ```

## !flya

This module checks for players using Fly hacks, when a player is detected using fly hacks it flaggs them and telports them back to the last known location when they were on the ground.

> ```Toggle
> !flya
> ```


## !freeze

The freeze command allows you to freeze a player, they wont be able to see but will see an image saying they are frozen. The same command acts as a toggle to freeze and unfreeze a player.

> ```Toggle
> !freeze Pete9xi
> ```


## !fullreport

This command prints in chat to the paradox opped player that ran the command a full list of every player with thier current gamemode coordinates as well as any violations they may have.

> ```Command
> !fullreport
> ```

## !gohome
?> The gohome command can be used by all players

This command allows a player to teleport to a saved location. There is a cool down timer that can be configured in config.js

> ```Command
> !gohome Base
> ```

File: `scripts/data/config.js`

> ```js
> 		goHome: {
            seconds: 0,
            minutes: 5,
            hours: 0,
            days: 0,
        },
> ```


## !help

The help command is self explanitory however both paradox oppped and no paradox opped players can use this command, for paradox oppped players you will see a list of all commands, non paradox oppped players will see a list of commands that the player can use.

> ```Command
> !help
> ```

## !hotbar

The hotbar command can be used to set a message above every players hotbar. running the command below will enable the hotbar message that is currently set in config.js

> ```Command
> !hotbar
> ```

Running the command below will enable the hotbar and set a new message.

> ```Command
> !hotbar Anarchy Server | Realm Code: 34fhf843
> ```

To disable the hotbar if enable you can run the following command.

> ```Command
> !hotbar disable
> ```

## !illegalenchant

This module when enabled will check all players who are not paradox opped for illegal enchantments on items that cannot be enchanted as well as items that can be, if an enchatment is detected above the vanllia values the player is banned and their inventory will be wiped clean.

> ```Toggle
> !illegalenchant
> ```

## !illegalitemsa

This module checks for items within the players inventory that are classed as illegal, there is a list by deafult that can be edited. If a player has an illegal item in their inventory they will be banned and their inventory will be wiped.

File: `scripts/data/itemban.js`

> ```Toggle
> !illegalitemsa
> ```

## !illegalitemsb
This module checks for players placing illegal items within the world, if detected they are also banned. for example if a player placed an end portal frame.

> ```Toggle
> !illegalitemsb
> ```

## !illegalitemsc

This module checks for players dropping illegal items within the world, if detected they are also banned. for example if a player dropped an end portal frame.

> ```Toggle
> !illegalitemsc
> ```

## !illegallores

This module checks for illegal lores on items.

> ```Toggle
> !illegallores
> ```

## !invsee
This command allows you to view the invetory of another player it will print all items to chat as well as there enchantment status, this is only shown to the paradox opped player who ran the command


> ```Command
> !invsee Pete9xi
> ```

## !invalidsprinta

This module checks for illegal sprinting with blindness effect applied. 

> ```Toggle
> !invalidsprinta
> ```

## !jesusa

This module checks for players who are using movement hacks that allow them to run on water and lava.

> ```Toggle
> !jesusa
> ```

## !listhome

?> This command can be used by all players.

This command allows a player to list thier saved locations.

> ```Command
> !listhome
> ```

## !listitems

!> This is a debug command used by the developers.

## !lockdown

This command locks down the server preventing any player who is not paradox oppped from joing when enabled if there are players who are not paradox opped but are connected will be kicked from the server.

> ```Toggle
> !lockdown
> ```

## !mute

This command allows you to mute the specified user and optionally gives reason as to why they were muted, this will prevent that player talking in chat.

> ```Command
> !mute Pete9xi Spamming offensive words in chat.
> ```


## !namespoofa

This module checks for player's name exceeding character limitations.

> ```Toggle
> !namespoofa
> ```

## !namespoofb

This module checks for player's name that has Non ASCII characters

> ```Toggle
> !namespoofb
> ```

## !notify

This module enables notifcations, when paradox flags a player for example if a paradox opped member of staff has notifctions enabled they will be sent an alert.

Enable notifcations for yourself.

> ```Toggle
> !notify
> ```

Enable notifications for another paradox opped player.

> ```Toggle
> !notify Pete9xi
> ```

To disable notifcations re run the command.

## !op

The op command is used to add Op to a player for Paradox AntiCheat features.

> ```Example without a password
> !op Pete9xi
> ```

> ```Example with a password
> !op MyPassword123$
> ```

> ```Example Opping another player.
> !op MyPassword123$ Visual1mpact
> ```

## !ops

!> This module is subjected to change due to new devlopments in the scripting API.

This module when enabled only requires one player to sleep in order for the night to be skipped.

> ```Toggle
> !ops
> ```

## !overridecbe

This command forces the commandblocksenabled gamerule to be enabled or disabled at all times.

> ```Toggle
> !overridecbe
> ```

## !paradoxui

?> This command can be used by all players.

This command triggers the UI version of paradox to open. You must close chat afterwards as only one UI element can be open at any one time.

> ```Command
> !paradoxui
> ```

## !prefix

This command allows you to change the default prefix which is `!` You can use up to two characters.

> ```Command
> !prefix $
> ```

## !pvp

?> This command can be used by all players.

This command allows all players to enable or disable PVP this is per player based so for example if player a has pvp enabled but player b has pvp disable, when player a attacks player b, no damage will be delt and player a will be warned that player b has PVP disabled.

> ```Command
> !pvp enable
> ```

> ```Command
> !pvp disable
> ```

## !rank

This command allows you to add edit or remove a rank from a player this is full customizable you are able to use colour codes.

This example uses the classic paradox member chat rank.

> ```Command
> !rank Pete9xi §4[§6Member§4]
> ```

## !reacha

This module checks for player's placing blocks beyond reach if detected its possible that they are using a reach hack, we only flag people for reach. As further investigation is need by staff to confirm if they player is indeed using reach hacks.

> ```Toggle
> !reacha
> ```

## !reachb

This module checks for player's attacking beyond reach, again a player will be flagged if they are attacking beyond the normal reach values if you get notified of this its up to staff to investigate what is happening and complete the appropriate action

> ```Toggle
> !reachb
> ```

## !removecb

When this module is enabled all command blocks will be cleared from the world this includes placed ones if you use command blocks in your world as part of shops or spawn protection you may want to keep this disabled.

> ```Toggle
> !removecb
> ```

## !report

This is a command to be used by normal players it allows them to report people who maybe using hacks.

> ```Command
> !report Pete9xi possible reach hacks.
> ```


## !salvage

This allows you to enable or disable the salvage system, what this does is when an block is placed paradox removes the placed block encase it contains NBT data that could be used as an exploit, what it will do is replace a vanilla copy of this block in the same place the previous one was placed. 

> ```Toggle
> !salvage
> ```

## !sethome

?> This command can be used by all players.

This command allows a player to set the current location as a new saved location. Providing they have not set more than 5 homes which is the default limit this can be changed in config.js.

> ```Command
> !sethome TheBarn
> ```

File: `scripts/data/config.js`

> ```js
> 		 setHome: {
            enabled: true,
            max: 5,
        },
> ```

## !showrules

This allows you to enable or disable the module to display server rules when a player joins the server. the rules can be edited in config.js

> ```Toggle
> !showrules
> ```


File: `scripts/data/config.js`

> ```js
> 		 showrules: {
            enabled: true,
            rule1: "Rule1: No hacking allowed.",
            rule2: "Rule2: Don't grief other players' builds.",
            rule3: "Rule3: Be kind to everyone on the server.",
            rule4: "Rule4: Follow the staff's instructions.",
            rule5: "Rule5: No spamming or advertising.",
        },
> ```



## !spammera

This module when enabled checks for messages sent while moving.

> ```Toggle
> !spammera
> ```

## !spammerb

This module when enabled checks for messages sent while swinging.

> ```Toggle
> !spammerb
> ```


## !spammerc

This module when enabled checks for messages sent while using items.

> ```Toggle
> !spammerc
> ```


## !spawnprotection

This module allows you to set a center coordinate, once set you can then specify the radius to check within, once enabled any player who is not paradox opped will be placed into adventure mode preventing them from mining and building within the spawn area. When they are out side of the radius they will be put into survival mode allowing them to mine and build.

In this example configuration i have set a radius of 90 this means within 90 blocks around the center coordinate. 

> ```Command
> !spawnprotection 54 69 -16 90
> ```

To disable it you would run the following command

> ```Command
> !spawnprotection
> ```

## !stackban

This module checks for items in the players inventory that have a stack value above the vanilla value if so they are then flagged.

> ```Toggle
> !stackban
> ```

## !stats

This command allows you to pull the stats for a player.

> ```Command
> !stats Pete9xi
> ```


## !tpr

?> This command can be used by all players.

Paradox has a teleport request system. you can make a request but only one request to a player can be made at any one time. Request expire after 2 minutes. When sent a request the player can type approve or denie.

> ```Command
> !tpr Pete9xi
> ```

## !tpa

This command allows paradox op staff to telport to players its the same as /tp but they dont need server operator status.

> ```Command
> !tpa Pete9xi Visual1mpact
> ```

## !unban

This command allows you to unban a player when the command is executed the player is then added to a queue which means when they next go to logon to the server they will be unbanned.

> ```Command
> !unban Pete9xi
> ```

## !unmute

This command allows you to unmute a player who has been muted.

> ```Command
> !unmute Pete9xi
> ```

## !vanish

This command when ran makes you invisable to the world you are able to move around freely and spectate players, this is useful to see if a player is using hacks or could be cheating. The command is a toggle meaning that you use the same command to enable and disable.

> ```Toggle
> !vanish
> ```

## !version

This command will print the current version of paradox that is installed and running.

> ```Command
> !version
> ```


## !worldborder

This module when enable prevents player going past a set of coordinate if they attempt to they are then telported back inside the wall. 

When enabling you can set a worldborder for each dimension the the command below sets a boarder of 10k in the overworld.

> ```Command
> !worldborder -o 10000
> ```

This example enables a border of 5k in the nether.

> ```Command
> !worldborder -n 5000
> ```

This example enables a border of 100k in the end.

> ```Command
> !worldborder -e 100000
> ```

To disable the worldborder run the following command.

> ```Command
> !worldborder disable
> ```


## !xraya

This module monitors for players mining ore, it flags the player and the coordinates as to where they are mining this allows you to determine if they are using xray hacks

> ```Toggle
> !xraya
> ```
