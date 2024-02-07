// Broken in 1.20.60 Mojang made both chat events read-only
import { world, system } from "@minecraft/server";
import { sendMsgToPlayer } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { ChatChannelManager } from "../../../classes/ChatChannelManager.js";

const beforeChatFilter = () => {
    // Subscribe to the 'beforeChat' event
    world.beforeEvents.chatSend.subscribe((msg) => {
        const { message, sender: player } = msg;

        // Check if the player is muted
        if (player.hasTag("isMuted")) {
            sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You are currently muted.`);
            msg.cancel = true; // Cancel the chat message
            return;
        }

        // Retrieve the 'chatranks_b' dynamic property
        const chatRanksBoolean = dynamicPropertyRegistry.get("chatranks_b");
        // Get the channel name associated with the player
        const channelName = ChatChannelManager.getPlayerChannel(player.id);
        if (message.startsWith("!")) {
            msg.cancel = true; // Cancel the chat message
            return;
        }

        // Check if chat ranks are enabled
        if (chatRanksBoolean === true) {
            // Get the player's tags and find their rank
            const tags = player.getTags();
            const rankTag = tags.find((tag) => tag.startsWith("Rank:")) || "Rank:§4[§6Member§4]";
            const rank = rankTag.replace("Rank:", "").replaceAll("--", "");

            // Format the chat message with the rank
            const formattedMessage = `${rank} §7${player.name}: §r${message}`;
            // Encrypt and update the message
            let msgToSend = channelName ? `§4[§6${channelName}§4] §7${player.name}: §r${message}` : formattedMessage;
            system.run(() => {
                player.sendMessage(msgToSend);
            });
        } else if (channelName) {
            // Format the chat message for channel
            const formattedMessage = `§4[§6${channelName}§4] §f<${player.name}> §r${message}`;
            // Encrypt and update the message
            let msgToSendViaChannel = formattedMessage;
            system.run(() => {
                player.sendMessage(msgToSendViaChannel);
            });
        }
    });
};

export { beforeChatFilter };
