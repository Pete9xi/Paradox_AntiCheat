import { world, PlayerPlaceBlockAfterEvent, Vector3, PlayerPlaceBlockBeforeEvent, PlayerLeaveAfterEvent } from "@minecraft/server";
import config from "../../../data/config.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { flag } from "../../../util.js";
import { MinecraftBlockTypes } from "../../../node_modules/@minecraft/vanilla-data/lib/index.js";

function afterreacha(
    object: PlayerPlaceBlockAfterEvent,
    blockPlaceReachData: Map<string, { blockLocation: Vector3; playerLocation: Vector3 }>,
    afterPlayerPlaceCallback: (arg: PlayerPlaceBlockAfterEvent) => void,
    beforePlayerPlaceCallback: (arg: PlayerPlaceBlockBeforeEvent) => void,
    afterPlayerLeaveCallback: (arg: PlayerLeaveAfterEvent) => void
) {
    // Get Dynamic Property
    const reachABoolean = dynamicPropertyRegistry.get("reacha_b");

    // Unsubscribe if disabled in-game
    if (reachABoolean === false) {
        blockPlaceReachData.clear();
        world.afterEvents.playerLeave.unsubscribe(afterPlayerLeaveCallback);
        world.beforeEvents.playerPlaceBlock.unsubscribe(beforePlayerPlaceCallback);
        world.afterEvents.playerPlaceBlock.unsubscribe(afterPlayerPlaceCallback);
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
    // Before Reach Data
    const beforeLocation = blockPlaceReachData.get(player.id);
    if (!beforeLocation) {
        return;
    }

    // Calculate the distance squared between the player and the block being placed
    const dx = x - beforeLocation.playerLocation.x;
    const dy = y - beforeLocation.playerLocation.y;
    const dz = z - beforeLocation.playerLocation.z;
    const distanceSquared = dx * dx + dy * dy + dz * dz;
    const roundedDistanceSquared = Math.floor(distanceSquared); // Round down the distanceSquared

    if (roundedDistanceSquared > config.modules.reachA.reach * config.modules.reachA.reach) {
        dimension.getBlock({ x: x, y: y, z: z }).setType(MinecraftBlockTypes.Air);
        flag(player, "Reach", "A", "Placement", null, null, "reach", Math.sqrt(distanceSquared).toFixed(3), false);
    }
}

const AfterReachA = (
    object: PlayerPlaceBlockAfterEvent,
    blockPlaceReachData: Map<string, { blockLocation: Vector3; playerLocation: Vector3 }>,
    afterPlayerPlaceCallback: (arg: PlayerPlaceBlockAfterEvent) => void,
    beforePlayerPlaceCallback: (arg: PlayerPlaceBlockBeforeEvent) => void,
    afterPlayerLeaveCallback: (arg: PlayerLeaveAfterEvent) => void
) => {
    afterreacha(object, blockPlaceReachData, afterPlayerPlaceCallback, beforePlayerPlaceCallback, afterPlayerLeaveCallback);
};

export { AfterReachA };
