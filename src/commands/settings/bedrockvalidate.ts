import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { BedrockValidate } from "../../penrose/TickEvent/bedrock/bedrockvalidate.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the BedrockValidate command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} bedrockValidateBoolean - The status of BedrockValidate module.
 * @param {boolean} setting - The status of the BedrockValidate custom command setting.
 */
function bedrockValidateHelp(player: Player, prefix: string, bedrockValidateBoolean: boolean, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = bedrockValidateBoolean ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: bedrockvalidate`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: bedrockvalidate [options]`,
        `§4[§6Optional§4]§f: help`,
        `§4[§6Options§4]§f:`,
        `    -h, --help      Display this help message`,
        `    -s, --status    Display the current status of BedrockValidate module`,
        `    -e, --enable    Enable BedrockValidate module`,
        `    -d, --disable   Disable BedrockValidate module`,
        `§4[§6Description§4]§f: Toggles checks for bedrock validations.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}bedrockvalidate --help`,
        `    ${prefix}bedrockvalidate --status`,
        `    ${prefix}bedrockvalidate --enable`,
        `    ${prefix}bedrockvalidate --disable`,
    ]);
}

/**
 * Handles the BedrockValidate command.
 * @name bedrockvalidate
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function bedrockvalidate(message: ChatSendAfterEvent, args: string[]) {
    handleBedrockValidate(message, args).catch((error) => {
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
 * Handles the execution of the BedrockValidate command.
 * @param {ChatSendAfterEvent} message - The message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleBedrockValidate(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/bedrockValidate.js:36)`);
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
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
                return bedrockValidateHelp(player, prefix, configuration.modules.bedrockValidate.enabled, configuration.customcommands.bedrockvalidate);
            case "-s":
            case "--status":
                // Handle status flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f BedrockValidate module is currently ${configuration.modules.bedrockValidate.enabled ? "enabled" : "disabled"}`);
                break;
            case "-e":
            case "--enable":
                // Handle enable flag
                if (configuration.modules.bedrockValidate.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f BedrockValidate module is already enabled.`);
                } else {
                    configuration.modules.bedrockValidate.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6BedrockValidate§f!`);
                    BedrockValidate();
                }
                break;
            case "-d":
            case "--disable":
                // Handle disable flag
                if (!configuration.modules.bedrockValidate.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f BedrockValidate module is already disabled.`);
                } else {
                    configuration.modules.bedrockValidate.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4BedrockValidate§f!`);
                }
                break;
            default:
                // Handle unrecognized flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid option. Use ${prefix}bedrockvalidate --help for more information.`);
                break;
        }
    } else {
        // No additional arguments provided, display help
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}bedrockvalidate --help for more information.`);
    }
}
