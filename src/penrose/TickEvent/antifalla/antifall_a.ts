import { world, EntityQueryOptions, GameMode, system, Block, EntityEquippableComponent, EquipmentSlot, Enchantment, ItemComponentTypes } from "@minecraft/server";
import { flag } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { MinecraftEffectTypes } from "../../../node_modules/@minecraft/vanilla-data/lib/index.js";

function antifalla(id: number) {
    // Get Dynamic Property
    const antifallABoolean = dynamicPropertyRegistry.get("antifalla_b");

    // Unsubscribe if disabled in-game
    if (!antifallABoolean) {
        system.clearRun(id);
        return;
    }

    //exclude players who are in creative.
    const gm: EntityQueryOptions = {
        excludeGameModes: [GameMode.creative, GameMode.spectator],
    };
    const filteredPlayers = world.getPlayers(gm);

    const airBlocksToCheck = new Set<{ dx: number; dy: number; dz: number }>([
        //check for a half block that the player maybe standing on if its a lower slab
        { dx: 0, dy: -0.5, dz: 0 },
        { dx: 0, dy: -1, dz: 0 },
        { dx: 1, dy: -1, dz: 0 },
        { dx: -1, dy: -1, dz: 0 },
        { dx: 0, dy: -1, dz: 1 },
        { dx: 0, dy: -0.5, dz: 1 },
        { dx: 0, dy: -1, dz: -1 },
        { dx: 0, dy: -0.5, dz: -1 },
        { dx: 1, dy: -1, dz: 1 },
        { dx: 1, dy: -0.5, dz: 1 },
        { dx: 1, dy: -1, dz: -1 },
        { dx: 1, dy: -0.5, dz: -1 },
        { dx: -1, dy: -1, dz: 1 },
        { dx: -1, dy: -0.5, dz: 1 },
        { dx: -1, dy: -1, dz: -1 },
        { dx: -1, dy: -0.5, dz: -1 },
    ]);

    for (const player of filteredPlayers) {
        // Get unique ID
        const uniqueId = dynamicPropertyRegistry.get(player?.id);

        // Skip if they have permission
        if (uniqueId === player.name) {
            continue;
        }
        if (player.isSleeping) {
            continue;
        }
        if (player.getEffect(MinecraftEffectTypes.Levitation)) {
            continue;
        }
        //trident check
        const equipment = player.getComponent("equippable") as EntityEquippableComponent;
        const mainhand = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (mainhand && mainhand.typeId === "minecraft:trident") {
            const enchantmentsComponent = mainhand.getComponent(ItemComponentTypes.Enchantable);
            const enchantmentList = enchantmentsComponent.getEnchantments;
            //@ts-ignore
            const iterator = enchantmentList[Symbol.iterator]();
            let iteratorResult = iterator.next();
            let targetEnchant = false;
            while (!iteratorResult.done) {
                const enchantment: Enchantment = iteratorResult.value;
                if (enchantment.type === "riptide") {
                    targetEnchant = true;
                }
                iteratorResult = iterator.next();
            }
            if (targetEnchant === true) {
                continue;
            }
        }

        const { x, y, z } = player.location;
        const vy = player.getVelocity().y;

        let allBlocksAreAir = true;
        for (const offset of airBlocksToCheck) {
            const offsetVector = { x: x + offset.dx, y: y + offset.dy, z: z + offset.dz };
            let block: Block | undefined;
            try {
                block = player?.dimension?.getBlock(offsetVector) || undefined;
            } catch {}
            if (!block || !block.isAir) {
                allBlocksAreAir = false;
                break;
            }
        }

        if (allBlocksAreAir && vy === 0) {
            flag(player, "AntiFall", "A", "Exploit", null, null, null, null, false);
        }
    }
}

/**
 * We store the identifier in a variable
 * to cancel the execution of this scheduled run
 * if needed to do so.
 */
export function AntiFallA() {
    const antiFallAId = system.runInterval(() => {
        antifalla(antiFallAId);
    }, 20);
}
