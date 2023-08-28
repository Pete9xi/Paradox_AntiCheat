import { Player, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { uiMUTE } from "../../../../moderation/uiMute";

export function muteHandler(player: Player) {
    //Mute ui
    const muteui = new ModalFormData();
    let onlineList: string[] = [];
    onlineList = Array.from(world.getPlayers(), (player) => player.name);
    muteui.title("§4Mute A Player In Chat.§4");
    muteui.dropdown(`\n§fSelect a player to mute:§f\n\nPlayer's Online\n`, onlineList);
    muteui.textField("Reason:", "Has been posting discord links.");
    muteui.show(player).then((muteResult) => {
        uiMUTE(muteResult, onlineList, player);
    });
}
