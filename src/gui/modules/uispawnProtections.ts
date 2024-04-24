import { Player, world } from "@minecraft/server";
import { ModalFormResponse } from "@minecraft/server-ui";
import { SpawnProtection } from "../../penrose/TickEvent/spawnprotection/spawnProtection.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { sendMsg, sendMsgToPlayer } from "../../util.js";
import { paradoxui } from "../paradoxui.js";
import { Vector3Builder } from "@minecraft/math";

export function uiSpawnProtection(spawnProtectionResult: ModalFormResponse, player: Player) {
    if (!spawnProtectionResult || spawnProtectionResult.canceled) {
        // Handle canceled form or undefined result
        return;
    }
    const [spawnProtectionToggle, spawnProtection_X, spawnProtection_Y, spawnProtection_Z, spawnProtection_Radius] = spawnProtectionResult.formValues;
    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.get(player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to configure Spawn Protection`);
    }
    if (spawnProtectionToggle === true) {
        // Allow
        dynamicPropertyRegistry.set("spawnProtection_b", true);
        world.setDynamicProperty("spawnProtection_b", true);
        const vector3 = new Vector3Builder(Number(spawnProtection_X), Number(spawnProtection_Y), Number(spawnProtection_Z));
        console.log(vector3);
        dynamicPropertyRegistry.set("spawnProtection_V3", vector3);
        world.setDynamicProperty("spawnProtection_V3", vector3);
        console.log(spawnProtection_Radius);
        dynamicPropertyRegistry.set("spawnProtection_Radius", Math.abs(Number(spawnProtection_Radius)));
        world.setDynamicProperty("spawnProtection_Radius", Math.abs(Number(spawnProtection_Radius)));
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6Spawn Protection§f!`);
        SpawnProtection();
    }
    if (spawnProtectionToggle === false) {
        // Deny
        dynamicPropertyRegistry.set("spawnProtection_b", false);
        world.setDynamicProperty("spawnProtection_b", false);
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4Spawn Protection§f!`);
    }

    //show the main ui to the player once complete.
    return paradoxui(player);
}
