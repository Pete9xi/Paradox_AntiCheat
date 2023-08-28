import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { dynamicPropertyRegistry } from "../../../../penrose/WorldInitializeAfterEvent/registry";
import { uiBEDROCKVALIDATION } from "../../../modules/uiBedrockValidation";

export function bedrockValidationHandler(player: Player) {
    const modulesbedrockvalidateui = new ModalFormData();
    const bedrockValidateBoolean = dynamicPropertyRegistry.get("bedrockvalidate_b") as boolean;
    modulesbedrockvalidateui.title("§4Paradox Modules - Bedrock Validation§4");
    modulesbedrockvalidateui.toggle("Bedrock Validate - Checks for bedrock validations:", bedrockValidateBoolean);
    modulesbedrockvalidateui.show(player).then((bedrockvalidationResult) => {
        uiBEDROCKVALIDATION(bedrockvalidationResult, player);
    });
}
