import { PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, PlayerLeaveAfterEvent, world } from "@minecraft/server";
import { AfterNukerA } from "../../PlayerBreakBlockAfterEvent/nuker/nuker_a";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry";

const breakData = new Map<string, { breakCount: number; lastBreakTimeBefore: number }>();

function onPlayerLogout(object: PlayerLeaveAfterEvent): void {
    // Remove the player's data from the map when they log off
    const playerName = object.playerId;
    breakData.delete(playerName);
}

async function beforenukera(object: PlayerBreakBlockBeforeEvent): Promise<void> {
    const antiNukerABoolean = dynamicPropertyRegistry.get("antinukera_b") as boolean;
    if (antiNukerABoolean === false) {
        breakData.clear();
        return;
    }

    const { player } = object;
    const playerID = player?.id;

    const uniqueId = dynamicPropertyRegistry.get(playerID);
    if (uniqueId === player.name) {
        return;
    }

    // Retrieve or initialize break data for the player
    const playerBreakData = breakData.get(playerID) || { breakCount: 0, lastBreakTime: 0 };

    // Increment break count and update last break time
    const updatedBreakData = {
        ...playerBreakData,
        breakCount: playerBreakData.breakCount + 1,
        lastBreakTimeBefore: Date.now(),
    };

    // Store the updated break data
    breakData.set(playerID, updatedBreakData);
}

const BeforeNukerA = () => {
    // Subscribe to the before event here
    const beforePlayerBreakBlockCallback = (object: PlayerBreakBlockBeforeEvent) => {
        // Call the AfterReachA function with the stored data
        beforenukera(object).catch((error) => {
            console.error("Paradox Unhandled Rejection: ", error);
            // Extract stack trace information
            if (error instanceof Error) {
                const stackLines = error.stack.split("\n");
                if (stackLines.length > 1) {
                    const sourceInfo = stackLines;
                    console.error("Error originated from:", sourceInfo[0]);
                }
            }
        });
    };

    // Subscribe to the after event here
    const afterPlayerLeaveCallback = (object: PlayerLeaveAfterEvent) => {
        // Call the AfterNukerA function with the stored data
        onPlayerLogout(object);
    };
    const afterPlayerBreakBlockCallback = (object: PlayerBreakBlockAfterEvent) => {
        // Call the AfterNukerA function with the stored data
        AfterNukerA(object, breakData, beforePlayerBreakBlockCallback, afterPlayerBreakBlockCallback, afterPlayerLeaveCallback);
    };

    // Subscribe to the before event
    world.beforeEvents.playerBreakBlock.subscribe(beforePlayerBreakBlockCallback);

    // Subscribe to the after event
    world.afterEvents.playerBreakBlock.subscribe(afterPlayerBreakBlockCallback);
    world.afterEvents.playerLeave.subscribe(afterPlayerLeaveCallback);
};

export { BeforeNukerA };
