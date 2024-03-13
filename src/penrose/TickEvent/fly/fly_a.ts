import { world, EntityQueryOptions, GameMode, system, Vector3, PlayerLeaveAfterEvent, Player, EntityEquippableComponent, EquipmentSlot, ItemComponentTypes } from "@minecraft/server";
import { flag } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { MinecraftBlockTypes, MinecraftEnchantmentTypes } from "../../../node_modules/@minecraft/vanilla-data/lib/index.js";

interface PlayerData {
    fallingData: boolean[]; // Array to record falling behavior
    surroundedByAirData: boolean[]; // Array to record surrounded-by-air data
}

const playerDataMap = new Map<string, PlayerData>();

function onPlayerLogout(event: PlayerLeaveAfterEvent): void {
    // Remove the player's data from the map when they log off
    const playerName = event.playerId;
    playerDataMap.delete(playerName);
}

function getRandomOffset(): number {
    // Generate a random offset in the range [-10, 10]
    return Math.random() * 20 - 10;
}

function getRandomizedCoordinates(player: Player): Vector3 {
    const { x, y, z } = player.location;

    // Randomize coordinates within a radius of 10
    const randomizedX = x + getRandomOffset();
    const randomizedY = y + getRandomOffset();
    const randomizedZ = z + getRandomOffset();

    return { x: randomizedX, y: randomizedY, z: randomizedZ };
}

function recordFallingBehavior(playerId: string, isFalling: boolean) {
    if (!playerDataMap.has(playerId)) {
        playerDataMap.set(playerId, {
            fallingData: [],
            surroundedByAirData: [],
        });
    }

    const playerData = playerDataMap.get(playerId);
    playerData.fallingData.push(isFalling);
}

function recordSurroundedByAir(playerId: string, isSurroundedByAir: boolean) {
    if (playerDataMap.has(playerId)) {
        const playerData = playerDataMap.get(playerId);
        playerData.surroundedByAirData.push(isSurroundedByAir);
    }
}

function analyzePlayerData(player: Player) {
    const playerData = playerDataMap.get(player.id);
    if (!playerData) return;

    let isPotentialFlying = false;

    const fallingData = playerData.fallingData;
    const surroundedByAirData = playerData.surroundedByAirData;

    const minDataCount = 3;
    if (fallingData.length < minDataCount || surroundedByAirData.length < minDataCount) {
        return;
    }

    const fallingCount = fallingData.filter((isFalling) => isFalling).length;
    const airCount = surroundedByAirData.filter((isSurroundedByAir) => isSurroundedByAir).length;

    // Adjust threshold based on observation
    const threshold = 2;

    if (fallingCount - airCount >= threshold) {
        // Majority indicates falling
        // Set isPotentialFlying to false
        isPotentialFlying = false;
    } else if (airCount - fallingCount >= threshold) {
        // Majority indicates surrounded by air (potential flying)
        // Set isPotentialFlying to true
        isPotentialFlying = true;
    }

    fallingData.shift();
    surroundedByAirData.shift();

    if (isPotentialFlying) {
        // Take appropriate action
        handlePotentialFlying(player);
    }
}

function checkSurroundedByAir(player: Player): boolean {
    const { x, y, z } = player.location;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                const block = player.dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });

                if (block.typeId !== MinecraftBlockTypes.Air) {
                    return false;
                }
            }
        }
    }

    return true;
}

function handlePotentialFlying(player: Player): void {
    try {
        // Teleport the player to randomized coordinates within a radius of 10
        const randomizedCoords = getRandomizedCoordinates(player);
        player.teleport(randomizedCoords, {
            dimension: player.dimension,
            rotation: { x: 0, y: 0 },
            facingLocation: { x: 0, y: 0, z: 0 },
            checkForBlocks: true,
            keepVelocity: false,
        });

        // Flag the player
        flag(player, "Fly", "A", "Exploit", null, null, null, null, false);
    } catch (error) {
        // Handle teleportation error
    }
}

function flya(id: number) {
    // Get Dynamic Property
    const flyABoolean = dynamicPropertyRegistry.get("flya_b");
    // Unsubscribe if disabled in-game
    if (flyABoolean === false) {
        world.afterEvents.playerLeave.unsubscribe(onPlayerLogout);
        system.clearRun(id);
        return;
    }
    // Exclude creative, and spectator gamemode
    const gm: EntityQueryOptions = {
        excludeGameModes: [GameMode.creative, GameMode.spectator],
    };
    const filteredPlayers = world.getPlayers(gm);
    // run as each player who are in survival
    for (const player of filteredPlayers) {
        // Get unique ID
        const uniqueId = dynamicPropertyRegistry.get(player?.id);
        if (uniqueId === player.name) {
            continue;
        }
        //Check if the player is gliding... temp fix!
        const glideCheck = player.isGliding;
        if (glideCheck) {
            continue;
        }
        //trident check
        const equipment = player.getComponent("equippable") as EntityEquippableComponent;
        const mainhand = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (mainhand && mainhand.typeId === "minecraft:trident") {
            const enchantmentsComponent = mainhand.getComponent(ItemComponentTypes.Enchantable);

            if (enchantmentsComponent.hasEnchantment(MinecraftEnchantmentTypes.Riptide)) {
                continue;
            }
        }

        const fallCheck = player.isFalling;
        if (fallCheck) {
            // Record falling data
            recordFallingBehavior(player.id, true);

            // Record if surrounded by air
            const isSurroundedByAir = checkSurroundedByAir(player);
            recordSurroundedByAir(player.id, isSurroundedByAir);
        } else {
            recordFallingBehavior(player.id, false);

            // Record if surrounded by air
            const isSurroundedByAir = checkSurroundedByAir(player);
            recordSurroundedByAir(player.id, isSurroundedByAir);
        }

        // Analyze the player's data
        analyzePlayerData(player);
    }
}

/**
 * We store the identifier in a variable
 * to cancel the execution of this scheduled run
 * if needed to do so.
 */
export function FlyA() {
    world.afterEvents.playerLeave.subscribe(onPlayerLogout);
    const flyAId = system.runInterval(() => {
        flya(flyAId);
    }, 20);
}
