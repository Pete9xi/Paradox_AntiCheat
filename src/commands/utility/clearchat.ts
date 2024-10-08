import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import ConfigInterface from "../../interfaces/Config.js";

function clearChatHelp(player: Player, prefix: string, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: clearchat`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Usage§4]§f: clearchat [optional]`,
        `§4[§6Optional§4]§f: help`,
        `§4[§6Description§4]§f: Will clear the chat.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}clearchat`,
        `        §4- §6Clear the chat§f`,
        `    ${prefix}clearchat help`,
        `        §4- §6Show command help§f`,
    ]);
}

/**
 * @name clearchat
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function clearchat(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./utility/notify.js:26)");
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Was help requested
    const argCheck = args[0];
    if ((argCheck && args[0].toLowerCase() === "help") || !configuration.customcommands.clearchat) {
        return clearChatHelp(player, prefix, configuration.customcommands.clearchat);
    }

    for (let clear = 0; clear < 10; clear++) sendMsg("@a", "\n".repeat(60));

    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f Chat has been cleared by §7${player.name}§f`);
}
