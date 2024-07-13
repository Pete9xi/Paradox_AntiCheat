import { world, EntityQueryOptions, GameMode, system, Vector3, Player, EntityEquippableComponent, EquipmentSlot, ItemComponentTypes } from "@minecraft/server";
import { flag } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { MinecraftEnchantmentTypes } from "../../../node_modules/@minecraft/vanilla-data/lib/index.js";

function getRandomizedCoordinates(player: Player): Vector3 {
    const { x, y, z } = player.location;

    // Randomize coordinates within a radius of 10
    const randomizedX = x + getRandomOffset();
    const randomizedY = y + getRandomOffset();
    const randomizedZ = z + getRandomOffset();

    return { x: randomizedX, y: randomizedY, z: randomizedZ };
}

function getRandomOffset(): number {
    // Generate a random offset in the range [-10, 10]
    return Math.random() * 20 - 10;
}
function flya(id: number) {
    // Get Dynamic Property
    const flyBBoolean = dynamicPropertyRegistry.get("flyb_b");
    // Unsubscribe if disabled in-game
    if (flyBBoolean === false) {
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
        const flyCheck = player.isFlying;
        const currentGameMode = player.getGameMode();
        if (!fallCheck && flyCheck && (currentGameMode == "survival" || currentGameMode == "adventure")) {
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
    }
}

export function FlyA() {
    const flyAId = system.runInterval(() => {
        flya(flyAId);
    }, 20);
}
