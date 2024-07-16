import { EntityInventoryComponent, ItemStack, Player } from "@minecraft/server";

function giveParadoxUiItem(player: Player) {
    const targetPlayerinv = player.getComponent("inventory") as EntityInventoryComponent;
    const container = targetPlayerinv.container;
    let freeSlot: number;
    const maxSlots = 36; // Maximum number of slots in the player's inventory

    // Loop through the inventory
    for (let i = 0; i < maxSlots; i++) {
        const item = container.getItem(i);
        if (item?.typeId) {
        } else {
            freeSlot = i;
            break;
        }
    }
    const item = new ItemStack("minecraft:stick");
    item.nameTag = "paradox";
    container.setItem(freeSlot, item);
}
export const giveParadoxUiItemFunc = (player: Player) => {
    giveParadoxUiItem(player);
};
