import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { Adventure } from "../../penrose/TickEvent/gamemode/adventure.js";
import { Survival } from "../../penrose/TickEvent/gamemode/survival.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import ConfigInterface from "../../interfaces/Config.js";

function allowgmsHelp(player: Player, prefix: string, survivalGMBoolean: boolean, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    let moduleStatus: string;
    if (survivalGMBoolean === false) {
        moduleStatus = "§6[§4DISABLED§6]§f";
    } else {
        moduleStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: allowgms`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: allowgms [optional]`,
        `§4[§6Optional§4]§f: help`,
        `§4[§6Description§4]§f: Toggles Gamemode 0 (Survival) to be used.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}allowgms`,
        `    ${prefix}allowgms help`,
    ]);
}

/**
 * @name allowgms
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function allowgms(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/allowGMS.js:37)");
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
    if ((argCheck && args[0].toLowerCase() === "help") || !configuration.customcommands.allowgms) {
        return allowgmsHelp(player, prefix, configuration.modules.survivalGM.enabled, configuration.customcommands.allowgms);
    }

    if (configuration.modules.survivalGM.enabled === false) {
        // Allow
        configuration.modules.survivalGM.enabled = false;
        dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
        // Make sure at least one is allowed since this could cause serious issues if all were locked down
        // We will allow Adventure Mode in this case
        if (configuration.modules.adventureGM.enabled === true && configuration.modules.creativeGM.enabled === true) {
            configuration.modules.adventureGM.enabled = false;
            dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
            sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f Since all gamemodes were disallowed, Adventure mode has been enabled.`);
            Adventure();
            return;
        }
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disallowed §4Gamemode 0 (Survival)§f to be used!`);
        Survival();
    } else if (configuration.modules.survivalGM.enabled === true) {
        // Deny
        configuration.modules.survivalGM.enabled = false;
        dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has allowed §6Gamemode 0 (Survival)§f to be used!`);
    }
}
