import { ChatSendAfterEvent, world } from "@minecraft/server";
import { flag } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../../interfaces/Config.js";

function spammerc(msg: ChatSendAfterEvent) {
    // Get Dynamic Property
    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;
    const spammerCBoolean = configuration.modules.spammerC.enabled;

    // Unsubscribe if disabled in-game
    if (spammerCBoolean === false) {
        world.afterEvents.chatSend.unsubscribe(spammerc);
        return;
    }
    const player = msg.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Skip if they have permission
    if (uniqueId === player.name) {
        return;
    }

    // Spammer/C = checks if someone sends a message while using an item
    if (player.hasTag("right")) {
        flag(player, "Spammer", "C", "Misc", null, null, null, null, false);
    }
}

const SpammerC = () => {
    world.afterEvents.chatSend.subscribe(spammerc);
};

export { SpammerC };
