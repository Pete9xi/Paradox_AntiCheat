import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { dynamicPropertyRegistry } from "../../../../penrose/WorldInitializeAfterEvent/registry";
import { uiANTIKILLAURA } from "../../../modules/uiAntiKillaura";

export function antiKillAuraHandler(player: Player) {
    const modulesantikillaura = new ModalFormData();
    const antiKillAuraBoolean = dynamicPropertyRegistry.get("antikillaura_b") as boolean;
    modulesantikillaura.title("§4Paradox Modules - Anti KillAura§4");
    modulesantikillaura.toggle("Anti KillAura - Toggles checks for attacks outside a 90 degree angle:", antiKillAuraBoolean);
    modulesantikillaura.show(player).then((antikillauraResult) => {
        uiANTIKILLAURA(antikillauraResult, player);
    });
}
