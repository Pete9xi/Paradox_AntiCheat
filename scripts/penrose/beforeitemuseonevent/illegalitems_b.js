import * as Minecraft from "mojang-minecraft";
import { illegalitems } from "../../data/itemban.js";
import { disabler } from "../../util.js";

const World = Minecraft.world;

const IllegalItemsB = () => {
    World.events.beforeItemUseOn.subscribe(item => {
        // If somehow they bypass illegalitems/A then snag them when they use the item
        if (illegalitems.includes(item.item.id) && !item.source.hasTag('paradoxOpped')) {
            item.cancel = true;
            item.source.runCommand(`clear "${disabler(item.source.nameTag)}" "${item.item.id}"`);
            let tags = item.source.getTags();

            // This removes old ban tags
            tags.forEach(t => {
                if(t.startsWith("Reason:")) {
                    item.source.removeTag(t.slice(1));
                }
                if(t.startsWith("By:")) {
                    item.source.removeTag(t.slice(1));
                }
            });
            try {
                item.source.runCommand(`clear "${disabler(item.source.nameTag)}"`);
            } catch (error) {}
            try {
                item.source.runCommand(`tag "${disabler(item.source.nameTag)}" add "Reason:Illegal Item"`);
                item.source.runCommand(`tag "${disabler(item.source.nameTag)}" add "By:Paradox"`);
                item.source.addTag('isBanned');
            } catch (error) {
                item.source.triggerEvent('paradox:kick');
            }
        }
    });
};

export { IllegalItemsB };