import { ChatSendAfterEvent, Player, world } from "@minecraft/server";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { WorldExtended } from "../../classes/WorldExtended/World.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Saves a home location for a player
 *
 * @param player - The player whose home is being saved
 * @param args - Array containing arguments, including the name of the home
 * @param configuration - Configuration settings
 * @returns void
 */
function saveHome(player: Player, args: string[], configuration: ConfigInterface): void {
    // Get current location
    const { x, y, z } = player.location;

    const homex = x.toFixed(0);
    const homey = y.toFixed(0);
    const homez = z.toFixed(0);
    let currentDimension: string;

    args = args.slice(1);

    // Don't allow spaces
    if (args.length > 1 || args[0].trim().length === 0) {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f No spaces in names please!`);
        return;
    }

    // Hash the coordinates for security
    const salt = world.getDynamicProperty("crypt");

    // Make sure this name doesn't exist already and it doesn't exceed limitations
    let verify = false;
    let counter = 0;
    const tags = player.getTags();
    const tagsLength = tags.length;
    for (let i = 0; i < tagsLength; i++) {
        if (tags[i].startsWith("1337")) {
            // Decode it so we can verify if it already exists
            tags[i] = (world as WorldExtended).decryptString(tags[i], String(salt));
        }
        if (tags[i].startsWith(args[0].toString() + " X", 13)) {
            verify = true;
            sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Home with name '§7${args[0]}§f' already exists!`);
            break;
        }
        if (tags[i].startsWith("LocationHome:")) {
            counter = ++counter;
        }
        if (counter >= configuration.modules.setHome.max) {
            verify = true;
            sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You can only have §7${configuration.modules.setHome.max}§f saved locations at a time!`);
            break;
        }
    }
    if (verify === true) {
        return;
    }

    // Save which dimension they were in
    if (player.dimension.id === "minecraft:overworld") {
        currentDimension = "overworld";
    }
    if (player.dimension.id === "minecraft:nether") {
        currentDimension = "nether";
    }
    if (player.dimension.id === "minecraft:the_end") {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Not allowed to set home in this dimension!`);
        return;
    }

    const decryptedLocationString = `LocationHome:${args[0]} X:${homex} Y:${homey} Z:${homez} Dimension:${currentDimension}`;
    const security = (world as WorldExtended).encryptString(decryptedLocationString, salt as string);
    // Store their new home coordinates
    player.addTag(security);

    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Home '§7${args[0]}§f' has been set at §7${homex} ${homey} ${homez}§f!`);
}

/**
 * Provides help information for the sethome command
 *
 * @param player - The player to whom the help information is sent
 * @param prefix - Prefix used in commands
 * @param configuration - Configuration settings
 */
function setHomeHelp(player: Player, prefix: string, configuration: ConfigInterface) {
    const commandStatus: string = configuration.customcommands.sethome ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: sethome`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Usage§4]§f: sethome [optional]`,
        `§4[§6Description§4]§f: Saves home location based on current coordinates. Up to ${configuration.modules.setHome.max} total.`,
        `§4[§6Options§4]§f:`,
        `    -h, --help`,
        `       §4[§7Display this help message§4]§f`,
        `    -n <value>, --name <value>`,
        `       §4[§7Save current location with name§4]§f`,
        `    -m <value>, --max <value>`,
        `       §4[§7Set the maximum number of allowed homes§4]§f`,
        `    -e, --enable`,
        `       §4[§7Enable SetHome command§4]§f`,
        `    -d, --disable`,
        `       §4[§7Disable SetHome command§4]§f`,
        `    -s, --status`,
        `       §4[§7Display the current status of SetHome§4]§f`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}sethome --name barn`,
        `    ${prefix}sethome -n barn`,
        `    ${prefix}sethome --help`,
        `    ${prefix}sethome --max ${configuration.modules.setHome.max}`,
        `    ${prefix}sethome --disable`,
        `    ${prefix}sethome --enable`,
        `    ${prefix}sethome --status`,
    ]);
}

/**
 * @name sethome
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function sethome(message: ChatSendAfterEvent, args: string[]) {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? ./commands/utility/sethome.js:26)");
    }

    const player = message.sender;

    // Check for custom prefix
    const prefix = getPrefix(player);

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;
    const hasPermission = dynamicPropertyRegistry.getProperty(player, player?.id);

    if (!configuration.customcommands.sethome && !hasPermission) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f SetHome is currently disabled.`);
    }

    // Check for additional non-positional arguments
    if (args.length > 0) {
        const additionalArg: string = args[0].toLowerCase();

        // Handle additional arguments
        switch (additionalArg) {
            case "-h":
            case "--help":
                return setHomeHelp(player, prefix, configuration);
            case "-s":
            case "--status":
                // Handle status flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f SetHome is currently ${configuration.customcommands.sethome ? "enabled" : "disabled"} Allow Value: ${configuration.modules.setHome.max}`);
                break;
            case "-e":
            case "--enable":
                // Handle enable flag
                if (configuration.customcommands.sethome) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f SetHome is already enabled.`);
                } else {
                    if (!hasPermission) {
                        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f failed to enable §6SetHome§f! No permissions.`);
                        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to enable §6SetHome§f.`);
                    }
                    configuration.customcommands.sethome = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6SetHome§f!`);
                }
                break;
            case "-d":
            case "--disable":
                // Handle disable flag
                if (!configuration.customcommands.sethome) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f SetHome is already disabled.`);
                } else {
                    if (!hasPermission) {
                        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f failed to disable §6SetHome§f! No permissions.`);
                        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to disable §6SetHome§f.`);
                    }
                    configuration.customcommands.sethome = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4SetHome§f!`);
                }
                break;
            case "-m":
            case "--max": {
                // Handle max flag
                if (!hasPermission) {
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f failed to set max allowed for §6SetHome§f! No permissions.`);
                    return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to set max allowed for §6SetHome§f.`);
                }
                const numberConvert = Number(args[1]);
                if (isNaN(numberConvert)) {
                    return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid option. Use ${prefix}sethome --help for more information.`);
                }
                configuration.modules.setHome.max = numberConvert;
                dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has set §6SetHome§f max allowed to §6${numberConvert}§f!`);
                break;
            }
            case "-n":
            case "--name":
                // Handle name flag
                saveHome(player, args, configuration);
                break;
            default:
                // Handle unrecognized flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid option. Use ${prefix}sethome --help for more information.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}sethome --help for more information.`);
    }
}
