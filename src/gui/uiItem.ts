import { ItemUseAfterEvent, world } from "@minecraft/server";
import { paradoxui } from "./paradoxui";

function triggerParadoxui(data: ItemUseAfterEvent) {
    const { itemStack: ItemStack, source: player } = data;
    if (ItemStack.typeId == "minecraft:stick" && ItemStack.nameTag == "paradox") {
        paradoxui(player);
    }
}
export const triggerParadoxuiByItem = () => {
    world.afterEvents.itemUse.subscribe(triggerParadoxui);
};
