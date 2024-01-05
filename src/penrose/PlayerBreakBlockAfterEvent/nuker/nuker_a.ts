import { world, PlayerBreakBlockAfterEvent, system, EntityQueryOptions, PlayerLeaveAfterEvent, EntityInventoryComponent, ItemEnchantsComponent, PlayerBreakBlockBeforeEvent } from "@minecraft/server";
import { flag } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../../node_modules/@minecraft/vanilla-data/lib/index.js";
import config from "../../../data/config.js";
import { kickablePlayers } from "../../../kickcheck.js";

const lastBreakTime = new Map<string, number>();

function onPlayerLogout(event: PlayerLeaveAfterEvent): void {
    // Remove the player's data from the map when they log off
    const playerName = event.playerId;
    lastBreakTime.delete(playerName);
}

async function afternukera(
    object: PlayerBreakBlockAfterEvent,
    breakData: Map<string, { breakCount: number; lastBreakTimeBefore: number }>,
    beforePlayerBreakBlockCallback: (object: PlayerBreakBlockBeforeEvent) => void,
    afterPlayerBreakBlockCallback: (object: PlayerBreakBlockAfterEvent) => void,
    afterPlayerLeaveCallback: (object: PlayerLeaveAfterEvent) => void
): Promise<void> {
    const antiNukerABoolean = dynamicPropertyRegistry.get("antinukera_b");
    if (antiNukerABoolean === false) {
        breakData.clear();
        lastBreakTime.clear();
        world.afterEvents.playerLeave.unsubscribe(onPlayerLogout);
        world.afterEvents.playerLeave.unsubscribe(afterPlayerLeaveCallback);
        world.afterEvents.playerBreakBlock.unsubscribe(afterPlayerBreakBlockCallback);
        world.beforeEvents.playerBreakBlock.unsubscribe(beforePlayerBreakBlockCallback);
        return;
    }

    const { block, player, dimension, brokenBlockPermutation } = object;
    const { x, y, z } = block.location;
    const uniqueId = dynamicPropertyRegistry.get(player?.id);
    if (uniqueId === player.name) {
        return;
    }

    const playerBreakData = breakData.get(player.id);

    if (!playerBreakData) {
        return;
    }

    const { breakCount, lastBreakTimeBefore: beforeLastBreakTime } = playerBreakData;

    // Ignore vegetation
    const vegetation = [
        /**
         * Leaves
         *
         * Oak, Spruce, Birch, Jungle, Acacia, Dark Oak,
         * Azalea, Flowering Azalea, Mangrove, Cherry.
         */
        MinecraftBlockTypes.Leaves,
        MinecraftBlockTypes.Leaves2,
        MinecraftBlockTypes.AzaleaLeaves,
        MinecraftBlockTypes.CherryLeaves,
        MinecraftBlockTypes.MangroveLeaves,

        /**
         * Saplings
         *
         * Oak, Sapling, Birch, Jungle, Acacia, Dark Oak,
         * Azalea, Flowering Azalea, Mangove Propagule, Cherry,
         * Bamboo.
         */
        MinecraftBlockTypes.BambooSapling,
        MinecraftBlockTypes.Sapling,
        MinecraftBlockTypes.CherrySapling,

        /**
         * Flowers
         *
         * Allium, Azure Bluet, Blue Orchid, Cornflower, Dandelion,
         * Lilac, Lily of the Valley, Orange Tulip, Oxeye Daisy,
         * Peony, Pink Tulip, Poppy, Red Tulip, Rose Bush, Sunflower,
         * White Tulip, Wither Rose, Chorus.
         */
        MinecraftBlockTypes.AzaleaLeavesFlowered,
        MinecraftBlockTypes.FloweringAzalea,
        MinecraftBlockTypes.RedFlower,
        MinecraftBlockTypes.ChorusFlower,
        MinecraftBlockTypes.YellowFlower,
        MinecraftBlockTypes.WitherRose,

        /**
         * Mushrooms
         *
         * Brown Mushroom, Brown Mushroom Block, Mushroom Stem,
         * Red Mushroom, Red Mushroom Block.
         */
        MinecraftBlockTypes.RedMushroom,
        MinecraftBlockTypes.RedMushroomBlock,
        MinecraftBlockTypes.BrownMushroom,
        MinecraftBlockTypes.BrownMushroomBlock,

        /**
         * Crops
         *
         * Bamboo, Cactus, Carved Pumpkin, Hay Bale,
         * Melon, Pumpkin, Sugar Cane, Potatoes, Carrots
         * Beetroot, Wheat.
         */
        MinecraftBlockTypes.MelonBlock,
        MinecraftBlockTypes.MelonStem,
        MinecraftBlockTypes.Potatoes,
        MinecraftBlockTypes.Pumpkin,
        MinecraftBlockTypes.CarvedPumpkin,
        MinecraftBlockTypes.PumpkinStem,
        MinecraftBlockTypes.Beetroot,
        MinecraftBlockTypes.Bamboo,
        MinecraftBlockTypes.Wheat,
        MinecraftBlockTypes.Carrots,
        MinecraftBlockTypes.Reeds,

        /**
         * Cave Plants
         *
         * Big Dripleaf, Glow Lichen, Hanging Roots,
         * Moss Block, Moss Carpet, Small Dripleaf,
         * Spore Blossom, Cave Vines.
         */
        MinecraftBlockTypes.GlowLichen,
        MinecraftBlockTypes.SmallDripleafBlock,
        MinecraftBlockTypes.BigDripleaf,
        MinecraftBlockTypes.CaveVines,
        MinecraftBlockTypes.CaveVinesBodyWithBerries,
        MinecraftBlockTypes.CaveVinesHeadWithBerries,
        MinecraftBlockTypes.MossBlock,
        MinecraftBlockTypes.MossCarpet,
        MinecraftBlockTypes.HangingRoots,
        MinecraftBlockTypes.SporeBlossom,

        /**
         * Shrubbery
         *
         * Dead Bush, Fern, Grass, Large Fern,
         * Lily Pad, Tall Grass, Vines
         */
        MinecraftBlockTypes.Azalea,
        MinecraftBlockTypes.DoublePlant,
        MinecraftBlockTypes.Tallgrass,
        MinecraftBlockTypes.Deadbush,
        MinecraftBlockTypes.Vine,
        MinecraftBlockTypes.TwistingVines,
        MinecraftBlockTypes.WeepingVines,
        MinecraftBlockTypes.ChorusPlant,

        /**
         * Nether
         *
         * Crimson Fungus, Warped Fungus, Nether Wart,
         * Nether Sprouts, Crimson Roots, Warped Roots.
         */
        MinecraftBlockTypes.CrimsonFungus,
        MinecraftBlockTypes.WarpedFungus,
        MinecraftBlockTypes.NetherWart,
        MinecraftBlockTypes.NetherSprouts,
        MinecraftBlockTypes.CrimsonRoots,
        MinecraftBlockTypes.WarpedRoots,

        /**
         * Water Plants
         *
         * Water Lily, Sea Grass, Kelp
         */
        MinecraftBlockTypes.Waterlily,
        MinecraftBlockTypes.Seagrass,
        MinecraftBlockTypes.Kelp,

        /**
         * Miscellaneous
         *
         * Blocks that I am too lazy to sort out right now
         */
        MinecraftBlockTypes.Cocoa,
        MinecraftBlockTypes.Cactus,
        MinecraftBlockTypes.SweetBerryBush,
        MinecraftBlockTypes.SnowLayer,
        MinecraftBlockTypes.PowderSnow,
        MinecraftBlockTypes.RedstoneWire,
        MinecraftBlockTypes.Scaffolding,
    ];

    const efficiencyLevels: Record<number, number> = {
        0: 0.625, // No enchantment
        1: 0.5, // Efficiency I
        2: 0.375, // Efficiency II
        3: 0.25, // Efficiency III
        4: 0.125, // Efficiency IV
        5: 0.0625, // Efficiency V
    };

    const now = Date.now();
    const lastBreakInSeconds = lastBreakTime.get(player.id) ? (beforeLastBreakTime - lastBreakTime.get(player.id)) / 1000 : undefined; // Use beforeLastBreakTime if lastBreakTime is not available
    const counter = breakCount || 0;

    const hand = player.selectedSlot;
    const inventory = player.getComponent("inventory") as EntityInventoryComponent;
    const container = inventory.container;
    const item = container.getItem(hand);
    const itemEnchantmentComponent = item?.getComponent("enchantments") as ItemEnchantsComponent;
    const itemEfficiencyLevel = itemEnchantmentComponent?.enchantments?.getEnchantment("efficiency")?.level || 0;

    const requiredTimeDifference = efficiencyLevels[itemEfficiencyLevel];

    if (!vegetation.includes(brokenBlockPermutation.type.id as MinecraftBlockTypes) && lastBreakInSeconds && lastBreakInSeconds < requiredTimeDifference) {
        if (counter >= 5) {
            const blockLoc = dimension.getBlock({ x: x, y: y, z: z });
            const blockID = brokenBlockPermutation.clone();

            flag(player, "Nuker", "A", "Break", null, null, null, null, false);
            blockLoc.setPermutation(blockID);
            lastBreakTime.delete(player.id);

            player.runCommandAsync(`kill @e[x=${x},y=${y},z=${z},r=10,c=1,type=item]`);

            // Apply effects or actions for three or more consecutive block breaks
            const effectsToAdd = [MinecraftEffectTypes.Blindness, MinecraftEffectTypes.MiningFatigue, MinecraftEffectTypes.Weakness, MinecraftEffectTypes.Slowness];

            for (const effectType of effectsToAdd) {
                player.addEffect(effectType, 1000000, { amplifier: 255, showParticles: true });
            }

            const hasFreezeTag = player.hasTag("paradoxFreeze");
            const hasNukerFreeze = player.hasTag("freezeNukerA");
            if (!hasFreezeTag) {
                player.addTag("paradoxFreeze");
            }
            if (!hasNukerFreeze) {
                player.addTag("freezeNukerA");
            }
            // Reset breakCount after three or more consecutive block breaks
            breakData.set(player.id, { breakCount: 0, lastBreakTimeBefore: now });
            //Has the user asked us to kick players?
            if (config.modules.antinukerA.kick == true) {
                player.runCommandAsync(`kick "${player.name}" §f§4[§6Paradox§4]§f You have been kicked for nuking.`);
                kickablePlayers.add(player);
                player.triggerEvent("paradox:kick");
            }
            return;
        } else {
            const increment = breakData.get(player.id).breakCount + 1;
            // Increment breakCount
            breakData.set(player.id, { breakCount: increment, lastBreakTimeBefore: now });
        }
    } else {
        // Reset breakCount when there is no offsense
        breakData.set(player.id, { breakCount: 0, lastBreakTimeBefore: now });
        // Update lastBreakTime based on after event
        lastBreakTime.set(player.id, now);
    }
}

function freeze(id: number) {
    const antiNukerABoolean = dynamicPropertyRegistry.get("antinukera_b");
    if (antiNukerABoolean === false) {
        system.clearRun(id);
        return;
    }

    const filter: EntityQueryOptions = {
        tags: ["freezeNukerA"],
        excludeTags: ["freezeAura", "freezeScaffoldA"],
    };
    const players = world.getPlayers(filter);
    for (const player of players) {
        if (!player) {
            return;
        }
        const tagBoolean = player.hasTag("paradoxFreeze");
        if (!tagBoolean) {
            player.removeTag("freezeNukerA");
            return;
        }
        player.onScreenDisplay.setTitle("§f§4[§6Paradox§4]§f Frozen!", { subtitle: "§fContact Staff §4[§6AntiNukerA§4]§f", fadeInDuration: 0, fadeOutDuration: 0, stayDuration: 60 });
    }
}

const AfterNukerA = (
    object: PlayerBreakBlockAfterEvent,
    breakData: Map<string, { breakCount: number; lastBreakTimeBefore: number }>,
    beforePlayerBreakBlockCallback: (object: PlayerBreakBlockBeforeEvent) => void,
    afterPlayerBreakBlockCallback: (object: PlayerBreakBlockAfterEvent) => void,
    afterPlayerLeaveCallback: (object: PlayerLeaveAfterEvent) => void
) => {
    afternukera(object, breakData, beforePlayerBreakBlockCallback, afterPlayerBreakBlockCallback, afterPlayerLeaveCallback).catch((error) => {
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
    world.afterEvents.playerLeave.subscribe(onPlayerLogout);
    const id = system.runInterval(() => {
        freeze(id);
    }, 20);
};

export { AfterNukerA };
