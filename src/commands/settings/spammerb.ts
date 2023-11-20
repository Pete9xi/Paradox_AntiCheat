import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { SpammerB } from "../../penrose/ChatSendBeforeEvent/spammer/spammer_b.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the spammerB command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} spammerBBoolean - The status of the spammerB module.
 * @param {boolean} setting - The status of the spammerB custom command setting.
 */
function spammerBHelp(player: Player, prefix: string, spammerBBoolean: boolean, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = spammerBBoolean ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: spammerb`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: spammerb [options]`,
        `§4[§6Description§4]§f: Toggles checks for messages sent while swinging.`,
        `§4[§6Options§4]§f:`,
        `    -h, --help`,
        `       §4[§7Display this help message§4]§f`,
        `    -s, --status`,
        `       §4[§7Display the current status of SpammerB module§4]§f`,
        `    -e, --enable`,
        `       §4[§7Enable SpammerB module§4]§f`,
        `    -d, --disable`,
        `       §4[§7Disable SpammerB module§4]§f`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}spammerb --help`,
        `    ${prefix}spammerb --status`,
        `    ${prefix}spammerb --enable`,
        `    ${prefix}spammerb --disable`,
    ]);
}

/**
 * @name spammerB
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function spammerB(message: ChatSendAfterEvent, args: string[]): void {
    handleSpammerB(message, args).catch((error) => {
        console.error("Paradox Unhandled Rejection: ", error);
        // Extract stack trace information
        if (error instanceof Error) {
            const stackLines = error.stack.split("\n");
            if (stackLines.length > 1) {
                const sourceInfo = stackLines;
                console.error("Error originated from:", sourceInfo[0]);
            }
        }
    });
}

/**
 * Handles the spammerB command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleSpammerB(message: ChatSendAfterEvent, args: string[]): Promise<void> {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/spammerb.js:36)`);
    }

    const player: Player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const configuration: ConfigInterface = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Check for custom prefix
    const prefix: string = getPrefix(player);

    // Check for additional non-positional arguments
    if (args.length > 0) {
        const additionalArg: string = args[0].toLowerCase();

        // Handle additional arguments
        switch (additionalArg) {
        case "-h":
        case "--help":
            // Display help message
            spammerBHelp(player, prefix, configuration.modules.spammerB.enabled, configuration.customcommands.spammerb);
            break;
        case "-s":
        case "--status":
            // Display current status of SpammerB module
            sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f SpammerB module is currently ${configuration.modules.spammerB.enabled ? "§aENABLED" : "§4DISABLED"}§f.`);
            break;
        case "-e":
        case "--enable":
            // Enable SpammerB module
            if (!configuration.modules.spammerB.enabled) {
                configuration.modules.spammerB.enabled = true;
                dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f ${player.name}§f has enabled §6SpammerB§f!`);
                SpammerB();
            } else {
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f SpammerB module is already enabled`);
            }
            break;
        case "-d":
        case "--disable":
            // Disable SpammerB module
            if (configuration.modules.spammerB.enabled) {
                configuration.modules.spammerB.enabled = false;
                dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f ${player.name}§f has disabled §4SpammerB§f!`);
            } else {
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f SpammerB module is already disabled`);
            }
            break;
        default:
            sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid argument. Use ${prefix}spammerb --help for command usage.`);
            break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}spammerb --help for command usage.`);
    }
}
