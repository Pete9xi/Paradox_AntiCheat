import { ChatSendAfterEvent, Player, world } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { WorldExtended } from "../../classes/WorldExtended/World.js";
import ConfigInterface from "../../interfaces/Config.js";

function lockdownHelp(player: Player, prefix: string, lockdownBoolean: boolean, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    let moduleStatus: string;
    if (lockdownBoolean === false) {
        moduleStatus = "§6[§4DISABLED§6]§f";
    } else {
        moduleStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: lockdown`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: lockdown [optional]`,
        `§4[§6Optional§4]§f: help`,
        `§4[§6Description§4]§f: Kicks player's from server excluding Staff for maintenance.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}lockdown`,
        `        §4- §6Initiate server lockdown for maintenance§f`,
        `    ${prefix}lockdown help`,
        `        §4- §6Show command help§f`,
    ]);
}

/**
 * @name lockdown
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function lockdown(message: ChatSendAfterEvent, args: string[]) {
    handleLockdown(message, args).catch((error) => {
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

async function handleLockdown(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/moderation/lockdown.js:37)");
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

    // Was help requested
    const argCheck = args[0];
    if ((argCheck && args[0].toLowerCase() === "help") || !configuration.customcommands.lockdown) {
        return lockdownHelp(player, prefix, configuration.modules.lockdown.enabled, configuration.customcommands.lockdown);
    }

    // If already locked down then unlock the server
    if (configuration.modules.lockdown.enabled) {
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f Server is no longer in lockdown!`);
        configuration.modules.lockdown.enabled = false;
        dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
        return;
    }

    // Default reason for locking it down
    const reason = "Under Maintenance! Sorry for the inconvenience.";

    // Lock it down
    const players = world.getPlayers();
    for (const pl of players) {
        // Check for hash/salt and validate password
        const hash = pl.getDynamicProperty("hash");
        const salt = pl.getDynamicProperty("salt");

        // Use either the operator's ID or the encryption password as the key
        const key = configuration.encryption.password ? configuration.encryption.password : pl.id;

        // Generate the hash
        const encode = (world as WorldExtended).hashWithSalt(salt as string, key);
        if (encode && hash !== undefined && encode === hash) {
            continue;
        }

        // Kick players from server
        pl.runCommandAsync(`kick ${pl.name} §f\n\n${reason}`).catch(() => {
            // Despawn players from server
            pl.triggerEvent("paradox:kick");
        });
    }
    // Shutting it down
    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f Server is in lockdown!`);
    configuration.modules.lockdown.enabled = true;
    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", true);
    return;
}
