import { world, PlayerPlaceBlockBeforeEvent, Vector3, PlayerPlaceBlockAfterEvent, PlayerLeaveAfterEvent } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { AfterReachA } from "../../PlayerPlaceBlockAfterEvent/reach/reach_a.js";

const blockPlaceReachData = new Map<string, { blockLocation: Vector3; playerLocation: Vector3 }>();

function onPlayerLogout(object: PlayerLeaveAfterEvent): void {
    // Remove the player's data from the map when they log off
    const playerName = object.playerId;
    blockPlaceReachData.delete(playerName);
}

function beforereacha(object: PlayerPlaceBlockBeforeEvent) {
    // Get Dynamic Property
    const reachABoolean = dynamicPropertyRegistry.get("reacha_b");

    // Unsubscribe if disabled in-game
    if (reachABoolean === false) {
        blockPlaceReachData.clear();
        return;
    }

    // Properties from class
    const { block, player } = object;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.get(player?.id);

    // Skip if they have permission
    if (uniqueId === player.name) {
        return;
    }

    blockPlaceReachData.set(player.id, { blockLocation: block.location, playerLocation: player.location });
}

const BeforeReachA = () => {
    // Subscribe to the before event here
    const beforePlayerPlaceCallBack = (object: PlayerPlaceBlockBeforeEvent) => {
        beforereacha(object);
    };

    // Subscribe to the after event here
    const afterPlayerLeaveCallback = (object: PlayerLeaveAfterEvent) => {
        // Call the AfterReachA function with the stored data
        onPlayerLogout(object);
    };
    const afterPlayerPlaceCallback = (object: PlayerPlaceBlockAfterEvent) => {
        // Call the AfterReachA function with the stored data
        AfterReachA(object, blockPlaceReachData, afterPlayerPlaceCallback, beforePlayerPlaceCallBack, afterPlayerLeaveCallback);
    };

    // Subscribe to the before event
    world.beforeEvents.playerPlaceBlock.subscribe(beforePlayerPlaceCallBack);

    // Subscribe to the after event
    world.afterEvents.playerPlaceBlock.subscribe(afterPlayerPlaceCallback);
    world.afterEvents.playerLeave.subscribe(afterPlayerLeaveCallback);
};

export { BeforeReachA };
