import { ChatSendAfterEvent, world } from "@minecraft/server";
import { handleCommandAfterSend } from "../../../commands/handler.js";
import {ChatSend}

function afterprefixcommand(msg: ChatSendAfterEvent) {
    handleCommandAfterSend(msg);
}

const AfterPrefixCommand = () => {
    world.afterEvents.chatSend.subscribe(afterprefixcommand);
};

export { AfterPrefixCommand };
