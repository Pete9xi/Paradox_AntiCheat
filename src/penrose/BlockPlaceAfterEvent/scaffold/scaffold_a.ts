import { world, MinecraftBlockTypes, BlockPlaceAfterEvent } from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, startTimer } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";

const blockTimer = new Map<string, Date[]>();

function scaffolda(object: BlockPlaceAfterEvent) {
    // Get Dynamic Property
    const antiScaffoldABoolean = dynamicPropertyRegistry.get("antiscaffolda_b");

    // Unsubscribe if disabled in-game
    if (antiScaffoldABoolean === false) {
        blockTimer.clear();
        world.afterEvents.blockPlace.unsubscribe(scaffolda);
        return;
    }

    // Properties from class
    const { block, player, dimension } = object;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.get(player?.id);

    // Skip if they have permission
    if (uniqueId === player.name) {
        return;
    }

    // Block coordinates
    const { x, y, z } = block.location;

    let timer: Date[];
    if (blockTimer.has(player.nameTag)) {
        timer = blockTimer.get(player.nameTag);
    } else {
        timer = [];
    }

    timer.push(new Date());

    const tiktok = timer.filter((time) => time.getTime() > new Date().getTime() - 100);
    blockTimer.set(player.nameTag, tiktok);

    /**
     * startTimer will make sure the key is properly removed
     * when the time for theVoid has expired. This will preserve
     * the integrity of our Memory.
     */
    const timerExpired = startTimer("scaffolda", player.name, Date.now());
    if (timerExpired.namespace.indexOf("scaffolda") !== -1 && timerExpired.expired) {
        const deletedKey = timerExpired.key; // extract the key without the namespace prefix
        blockTimer.delete(deletedKey);
    }

    if (tiktok.length >= config.modules.antiscaffoldA.max) {
        dimension.getBlock({ x: x, y: y, z: z }).setType(MinecraftBlockTypes.air);
        flag(player, "Scaffold", "A", "Placement", null, null, null, null, false);
        /*
        try {
            player.runCommand(`tag "${disabler(player.nameTag)}" add "
            :Illegal Scaffolding"`);
            player.runCommand(`tag "${disabler(player.nameTag)}" add "By:Paradox"`);
            player.addTag('isBanned');
        } catch (error) {
            kickablePlayers.add(player); player.triggerEvent('paradox:kick');
        }*/
    }
}

const ScaffoldA = () => {
    world.afterEvents.blockPlace.subscribe(scaffolda);
};

export { ScaffoldA };