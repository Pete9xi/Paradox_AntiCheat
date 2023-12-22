import { Player, Vector3 } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { dynamicPropertyRegistry } from "../../../../penrose/WorldInitializeAfterEvent/registry";
import { uiSpawnProtection } from "../../../modules/uispawnProtections";

export function spawnProtectionHandler(player: Player) {
    const modulesspui = new ModalFormData();
    const spawnProtectionBoolean = dynamicPropertyRegistry.get("spawnProtection_b") as boolean;
    const spawnProtectionVector3 = dynamicPropertyRegistry.get("spawnProtection_V3") as Vector3;
    const spawnProtectionRadius = dynamicPropertyRegistry.get("spawnProtection_Radius") as number;
    modulesspui.title("§4Paradox Modules - Spawn Protection§4");
    modulesspui.toggle("Enable Spawn Protection - ", spawnProtectionBoolean);
    modulesspui.textField("X Coordinate", "0", spawnProtectionVector3.x.toString());
    modulesspui.textField("Y Coordinate", "0", spawnProtectionVector3.y.toString());
    modulesspui.textField("Z Coordinate", "0", spawnProtectionVector3.z.toString());
    modulesspui.textField("Radius", "90", spawnProtectionRadius.toString());
    modulesspui
        .show(player)
        .then((spawnProtectionResult) => {
            uiSpawnProtection(spawnProtectionResult, player);
        })
        .catch((error) => {
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
}
