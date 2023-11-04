import { world, system } from "@minecraft/server";
import { sendMsg } from "../../../util.js";
import { clearItems } from "../../../data/clearlag.js";
import { kickablePlayers } from "../../../kickcheck.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../../interfaces/Config.js";

const cooldownTimer = new WeakMap();
// Just a dummy object to use with set/get
const object = { cooldown: "String" };

let warned = false; // variable to track whether the 60 second warning has been displayed
let clearLagId: number = null;

function createCountdown(configuration: ConfigInterface) {
    return {
        days: configuration.modules.clearLag.days,
        hours: configuration.modules.clearLag.hours,
        minutes: configuration.modules.clearLag.minutes,
        seconds: configuration.modules.clearLag.seconds,
    };
}

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
    const configuration = dynamicPropertyRegistry.getProperty(undefined, "config") as ConfigInterface;
    const clearLagBoolean = configuration.modules.clearLag.enabled;

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

    const countdown = createCountdown(configuration);

    const msSettings = countdown.days * 24 * 60 * 60 * 1000 + countdown.hours * 60 * 60 * 1000 + countdown.minutes * 60 * 1000 + countdown.seconds * 1000;
    const timeLeft = msSettings - (Date.now() - cooldownVerify);

    const timeLeftSeconds = Math.ceil(timeLeft / 1000);

    if (timeLeftSeconds <= 0) {
        clearEntityItems();
        clearEntities();
        cooldownTimer.delete(object);
        sendMsg("@a", `§f§4[§6Paradox§4]§f Server lag has been cleared!`);
        warned = false; // reset the warned variable so that the 60 second warning will display again next time
    } else if (timeLeftSeconds <= 60) {
        if (timeLeftSeconds === 60) {
            sendMsg("@a", `§f§4[§6Paradox§4]§f Server lag will be cleared in 1 minute!`);
        } else if (!warned && timeLeftSeconds <= 5) {
            sendMsg("@a", `§f§4[§6Paradox§4]§f Server lag will be cleared in ${timeLeftSeconds} seconds!`);
            warned = true;
        } else if (timeLeftSeconds === 1) {
            sendMsg("@a", `§f§4[§6Paradox§4]§f Server lag will be cleared in ${timeLeftSeconds} second!`);
        }
    }
}

/**
 * We store the identifier in a variable
 * to cancel the execution of this scheduled run
 * if needed to do so.
 */
export function ClearLag() {
    if (clearLagId !== null) {
        system.clearRun(clearLagId);
    }

    clearLagId = system.runInterval(() => {
        clearLag(clearLagId);
    }, 20);
}
