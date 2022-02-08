import * as Minecraft from "mojang-minecraft";

const World = Minecraft.world;

/**
 * @name notify
 * @param {object} message - Message object
 */
export function notify(message) {
    // validate that required params are defined
    if (!message) return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./utility/notify.js:8)");

    message.cancel = true;

    let player = message.sender;
    
    // make sure the user has permissions to run the command
    try {
        World.getDimension("overworld").runCommand(`testfor @a[name="${player.nameTag}",tag=op]`);
    } catch (error) {
        return World.getDimension("overworld").runCommand(`tellraw "${player.nameTag}" {"rawtext":[{"text":"§r§4[§6Paradox§4]§r "},{"text":"You need to be Paradox-Opped to use this command."}]}`);
    }

    return World.getDimension("overworld").runCommand(`execute "${player.nameTag}" ~~~ function notify`);
}
