# Prevents disabler hacks from possibly disabling the anticheat
gamerule randomtickspeed 1

# Runs All The Checks
function checks/angle
execute @s[type=player,tag=isBanned] ~~~ function checks/ban
function checks/cbe
function checks/epearlglitching
function checks/gamemode
function checks/illegalitems
execute @s[tag=moving,tag=!flying,m=!c,tag=!jump,tag=!riding,tag=!gliding,tag=!levitating,tag=!vanish] ~~~ function checks/jesus
function checks/others
execute @s[tag=moving,tag=!gliding,tag=!riding,tag=!vanish] ~~~ function checks/phase

# optional checks
execute @s[scores={commandblocks=1..}] ~~~ function checks/nocommandblocks
replaceitem entity @s[type=player,tag=!op,scores={frostwalker=1..}] slot.armor.feet 0 leather_boots 1 0 {"item_lock": {"mode": "lock_in_slot"},"keep_on_death":{}}
execute @s[type=player,scores={worldborder=1..}] ~~~ function checks/worldborder
