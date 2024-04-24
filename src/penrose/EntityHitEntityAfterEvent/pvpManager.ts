import { world, Player, EntityHitEntityAfterEvent, ProjectileHitEntityAfterEvent, PlayerLeaveAfterEvent, EntityDieAfterEvent } from "@minecraft/server";
import { sendMsg, sendMsgToPlayer } from "../../util.js";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

const pvpData = new Map<string, { counter: number; lastAttackedName: string }>();

function punishment(event: EntityDieAfterEvent) {
    const { damageSource, deadEntity } = event;

    const criminal = damageSource.damagingEntity;

    if (deadEntity instanceof Player && criminal instanceof Player && (criminal.hasTag("pvpDisabled") || deadEntity.hasTag("pvpDisabled"))) {
        sendMsgToPlayer(criminal, `§f§4[§6Paradox§4]§f You killed §7${deadEntity.name}§f while pvp was disabled. You were punished!`);
        criminal.kill();
        return;
    }
}

function onPlayerLogout(event: PlayerLeaveAfterEvent): void {
    // Remove the player's data from the map when they log off
    const playerId = event.playerId;
    pvpData.delete(playerId);
}
function pvpProjectile(event: ProjectileHitEntityAfterEvent) {
    const { source } = event;
    const data = event.getEntityHit();
    if (!(source instanceof Player) || !(data.entity instanceof Player)) {
        return;
    }
    if (data.entity.hasTag("pvpDisabled")) {
        sendMsgToPlayer(source, `§f§4[§6Paradox§4]§f This player has PVP Disabled!`);
        const effectsToAdd = [MinecraftEffectTypes.InstantHealth];
        for (const effectType of effectsToAdd) {
            data.entity.addEffect(effectType, 5, { amplifier: 255, showParticles: false });
        }
        const hitEntityId = data.entity.id;
        const pvpDataForHitEntity = pvpData.get(hitEntityId) || { counter: 0, lastAttackedName: "" };

        if (data.entity.name === pvpDataForHitEntity.lastAttackedName) {
            pvpDataForHitEntity.counter++;
        } else {
            pvpDataForHitEntity.lastAttackedName = data.entity.name;
            pvpDataForHitEntity.counter = 0;
        }

        if (pvpDataForHitEntity.counter === 10) {
            sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${source.name}§f has attacked §7${data.entity.name}§f while §7${data.entity.name}§f has PVP disabled.`);
            pvpDataForHitEntity.counter = 0;
            source.runCommandAsync(`kick "${source.name}" §f§4[§6Paradox§4]§f You engaged in pvp with a player who has disabled PVP you were warned 9 times, as a result you have been kicked.`);
            source.triggerEvent("paradox:kick");
            sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f ${source.name} has been kicked by pvpManager.`);
        }

        pvpData.set(hitEntityId, pvpDataForHitEntity);
        return;
    }
}
function pvp(obj: EntityHitEntityAfterEvent) {
    const { damagingEntity, hitEntity } = obj;

    if (!(hitEntity instanceof Player) || !(damagingEntity instanceof Player)) {
        return;
    }

    if (hitEntity.hasTag("pvpDisabled")) {
        sendMsgToPlayer(damagingEntity, `§f§4[§6Paradox§4]§f This player has PVP Disabled!`);

        const effectsToAdd = [MinecraftEffectTypes.InstantHealth];
        for (const effectType of effectsToAdd) {
            hitEntity.addEffect(effectType, 5, { amplifier: 255, showParticles: false });
        }

        const hitEntityId = hitEntity.id;
        const pvpDataForHitEntity = pvpData.get(hitEntityId) || { counter: 0, lastAttackedName: "" };

        if (hitEntity.name === pvpDataForHitEntity.lastAttackedName) {
            pvpDataForHitEntity.counter++;
        } else {
            pvpDataForHitEntity.lastAttackedName = hitEntity.name;
            pvpDataForHitEntity.counter = 0;
        }

        if (pvpDataForHitEntity.counter === 10) {
            sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${damagingEntity.name}§f has attacked §7${hitEntity.name}§f while §7${hitEntity.name}§f has PVP disabled.`);
            pvpDataForHitEntity.counter = 0;
        }

        pvpData.set(hitEntityId, pvpDataForHitEntity);
        return;
    }

    if (damagingEntity.hasTag("pvpDisabled")) {
        // Prevent attacking player with PvP disabled
        sendMsgToPlayer(damagingEntity, `§f§4[§6Paradox§4]§f You cannot attack while you have PvP Disabled!`);

        // Heal the player being attacked
        const effectsToAdd = [MinecraftEffectTypes.InstantHealth];
        for (const effectType of effectsToAdd) {
            hitEntity.addEffect(effectType, 5, { amplifier: 255, showParticles: false });
        }
    }
}

export const PVP = () => {
    world.afterEvents.entityDie.subscribe(punishment);
    world.afterEvents.entityHitEntity.subscribe(pvp);
    world.afterEvents.projectileHitEntity.subscribe(pvpProjectile);
    world.afterEvents.playerLeave.subscribe(onPlayerLogout);
};
