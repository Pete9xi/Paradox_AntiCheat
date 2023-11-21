import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { BeforeNukerA } from "../../penrose/PlayerBreakBlockBeforeEvent/nuker/nuker_a.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the AntiNukerA command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} antiNukerABoolean - The status of AntiNukerA module.
 * @param {boolean} setting - The status of the AntiNukerA custom command setting.
 */
function antinukeraHelp(player: Player, prefix: string, antiNukerABoolean: boolean, setting: boolean): void {
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = antiNukerABoolean ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: antinukera`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: antinukera [options]`,
        `§4[§6Description§4]§f: Monitors players for block nuking behavior.`,
        `§4[§6Options§4]§f:`,
        `    -h, --help`,
        `       §4[§7Display this help message§4]§f`,
        `    -s, --status`,
        `       §4[§7Display the current status of AntiNukerA module§4]§f`,
        `    -e, --enable`,
        `       §4[§7Enable AntiNukerA module§4]§f`,
        `    -d, --disable`,
        `       §4[§7Disable AntiNukerA module§4]§f`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}antinukera --help`,
        `    ${prefix}antinukera --status`,
        `    ${prefix}antinukera --enable`,
        `    ${prefix}antinukera --disable`,
    ]);
}

/**
 * @name antinukerA
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function antinukerA(message: ChatSendAfterEvent, args: string[]): void {
    handleAntiNukerA(message, args).catch((error) => {
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

async function handleAntiNukerA(message: ChatSendAfterEvent, args: string[]): Promise<void> {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | Error: ${message} isn't defined. Did you forget to pass it? (./commands/settings/antinukera.js:36)`);
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
        return;
    }

    // Get Dynamic Property Boolean
    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Check for additional non-positional arguments
    if (args.length > 0) {
        const additionalArg = args[0].toLowerCase();

        // Handle additional arguments
        switch (additionalArg) {
            case "-h":
            case "--help":
                return antinukeraHelp(player, prefix, configuration.modules.antinukerA.enabled, configuration.customcommands.antinukera);
            case "-s":
            case "--status":
            // Handle status flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AntiNukerA module is currently ${configuration.modules.antinukerA.enabled ? "enabled" : "disabled"}`);
                break;
            case "-e":
            case "--enable":
            // Handle enable flag
                if (configuration.modules.antinukerA.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AntiNukerA module is already enabled.`);
                } else {
                    configuration.modules.antinukerA.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6AntiNukerA§f!`);
                    BeforeNukerA();
                }
                break;
            case "-d":
            case "--disable":
            // Handle disable flag
                if (!configuration.modules.antinukerA.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AntiNukerA module is already disabled.`);
                } else {
                    configuration.modules.antinukerA.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4AntiNukerA§f!`);
                }
                break;
            default:
            // Handle unrecognized flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid option. Use ${prefix}antinukera --help for more information.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}antinukera --help for more information.`);
    }
}
