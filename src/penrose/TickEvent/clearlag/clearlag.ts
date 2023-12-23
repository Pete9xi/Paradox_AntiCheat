import { world, system } from "@minecraft/server";
import { sendMsg } from "../../../util.js";
import { clearItems } from "../../../data/clearlag.js";
import { kickablePlayers } from "../../../kickcheck.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import config from "../../../data/config.js";

const cooldownTimer = new WeakMap();
// Just a dummy object to use with set/get
const object = { cooldown: "String" };

const countdown = {
    days: config.modules.clearLag.days,
    hours: config.modules.clearLag.hours,
    minutes: config.modules.clearLag.minutes,
    seconds: config.modules.clearLag.seconds,
};

function clearEntityItems() {
    const filter = { type: "item" };
    const entitiesCache = world.getDimension("overworld").getEntities(filter);
    for (const entity of entitiesCache) {
        const itemName = entity.getComponent("item");
        if (itemName.typeId in clearItems) {
            entity.remove();
        }
    }
}

function clearEntities() {
    const entityException = ["minecraft:ender_dragon", "minecraft:shulker", "minecraft:hoglin", "minecraft:zoglin", "minecraft:piglin_brute", "minecraft:evocation_illager", "minecraft:vindicator", "minecraft:elder_guardian"];
    const filter = { families: ["monster"] };
    const entitiesCache = world.getDimension("overworld").getEntities(filter);
    for (const entity of entitiesCache) {
        // Ignore entity
        if (entityException.includes(entity.typeId) || entity.nameTag) {
            continue;
        }
        kickablePlayers.add(entity);
        entity.remove();
    }
}

function clearLag(id: number) {
    // Get Dynamic Property
    const clearLagBoolean = dynamicPropertyRegistry.get("clearlag_b");
    // Unsubscribe if disabled in-game
    if (clearLagBoolean === false) {
        system.clearRun(id);
        return;
    }

    let cooldownVerify = cooldownTimer.get(object);
    if (!cooldownVerify) {
        cooldownVerify = Date.now();
        cooldownTimer.set(object, cooldownVerify);
    }

    const msSettings = countdown.days * 24 * 60 * 60 * 1000 + countdown.hours * 60 * 60 * 1000 + countdown.minutes * 60 * 1000 + countdown.seconds * 1000;
    const timePassed = Date.now() - cooldownVerify;
    const timeLeft = msSettings - timePassed;

    const timeLeftSeconds = Math.round(timeLeft / 1000); // Round to second

    if (timeLeftSeconds <= 0) {
        clearEntityItems();
        clearEntities();
        cooldownTimer.delete(object);
        sendMsg("@a", `§f§4[§6Paradox§4]§f Server lag has been cleared!`);
    } else if (timeLeftSeconds <= 60) {
        if (timeLeftSeconds === 60) {
            sendMsg("@a", `§f§4[§6Paradox§4]§f Server lag will be cleared in 1 minute!`);
        } else if (timeLeftSeconds === 5) {
            sendMsg("@a", `§f§4[§6Paradox§4]§f Server lag will be cleared in ${timeLeftSeconds} seconds!`);
        } else if (timeLeftSeconds <= 5 && timeLeftSeconds > 1) {
            sendMsg("@a", `§f§4[§6Paradox§4]§f ${timeLeftSeconds} seconds...`);
        } else if (timeLeftSeconds === 1) {
            sendMsg("@a", `§f§4[§6Paradox§4]§f ${timeLeftSeconds} second...`);
        }
    }
}

/**
 * We store the identifier in a variable
 * to cancel the execution of this scheduled run
 * if needed to do so.
 */
export function ClearLag() {
    const clearLagId = system.runInterval(() => {
        clearLag(clearLagId);
    }, 20);
}
