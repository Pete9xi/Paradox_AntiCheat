import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { AFK } from "../../penrose/TickEvent/afk/afk.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the AFK command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {ConfigInterface} configuration - The current configuration.
 */
function afkHelp(player: Player, prefix: string, configuration: ConfigInterface): void {
    const commandStatus: string = configuration.customcommands.afk ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = configuration.modules.afk.enabled ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: afk`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: ${prefix}afk [options]`,
        `§4[§6Options§4]§f:`,
        `    -h, --help      Display this help message`,
        `    -s, --status    Display the current status of AFK`,
        `    -e, --enable    Enable AFK`,
        `    -d, --disable   Disable AFK`,
        `§4[§6Description§4]§f: Kicks players that are AFK for ${configuration.modules.afk.minutes} minutes.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}afk --help`,
        `    ${prefix}afk --status`,
        `    ${prefix}afk --enable`,
        `    ${prefix}afk --disable`,
    ]);
}

/**
 * Handles the AFK command.
 * @param {ChatSendAfterEvent} message - The message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function afk(message: ChatSendAfterEvent, args: string[]): void {
    handleAFK(message, args).catch((error) => {
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

async function handleAFK(message: ChatSendAfterEvent, args: string[]): Promise<void> {
    // Validate that required params are defined
    if (!message) {
        console.warn(`${new Date()} | Error: ${message} isn't defined. Did you forget to pass it? (./commands/settings/afk.js:36)`);
        return;
    }

    const player: Player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
        return;
    }

    // Get Dynamic Property Boolean
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
                return afkHelp(player, prefix, configuration);
            case "-s":
            case "--status":
                // Handle status flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AFK is currently ${configuration.modules.afk.enabled ? "enabled" : "disabled"}`);
                break;
            case "-e":
            case "--enable":
                // Handle enable flag
                if (configuration.modules.afk.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AFK is already enabled.`);
                } else {
                    configuration.modules.afk.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6AFK§f!`);
                    AFK();
                }
                break;
            case "-d":
            case "--disable":
                // Handle disable flag
                if (!configuration.modules.afk.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AFK is already disabled.`);
                } else {
                    configuration.modules.afk.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4AFK§f!`);
                }
                break;
            default:
                // Handle unrecognized flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid option. Use ${prefix}afk --help for more information.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}afk --help for more information.`);
    }
}
