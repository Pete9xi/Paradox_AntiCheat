import { EntityQueryOptions, Player, system, world } from "@minecraft/server";
import { kickablePlayers } from "../../../kickcheck";
import { dynamicPropertyRegistry } from "../../worldinitializeevent/registry";

function rip(player: Player, reason: string) {
    // Tag with reason and by who
    try {
        player.addTag(`Reason:${reason}`);
        player.addTag("By:Paradox");
        player.addTag("isBanned");
        // Despawn if we cannot kick the player
    } catch (error) {
        kickablePlayers.add(player);
        player.triggerEvent("paradox:kick");
    }
}
function autoban(id: number) {
    const scores = [
        "autoclickervl",
        "badpacketsvl",
        "killauravl",
        "flyvl",
        "illegalitemsvl",
        "interactusevl",
        "cbevl",
        "gamemodevl",
        "autototemvl",
        "spammervl",
        "namespoofvl",
        "noslowvl",
        "crashervl",
        "reachvl",
        "invmovevl",
        "invalidsprintvl",
        "armorvl",
        "antikbvl",
    ];
    const gm = new Object() as EntityQueryOptions;
    for (const player of world.getPlayers(gm)) {
        // Get unique ID
        const uniqueId = dynamicPropertyRegistry.get(player?.scoreboard?.id);

        // Skip if they have permission
        if (uniqueId === player.name) {
            return;
        }
        scores.forEach((score) => {
            try {
                const objective = world.scoreboard.getObjective(score);
                const playerScore = player.scoreboard.getScore(objective);
                if (playerScore > 50) {
                    let reReason: string = score.replace("vl", "").toUpperCase() + "number of Violations: " + playerScore;
                    return rip(player, reReason);
                }
            } catch {
                // Ignore since this score doesn't exist for this player yet.
            }
        });
    }
}

export function AutoBan() {
    const autoBanId = system.runInterval(() => {
        autoban(autoBanId);
        //set ticks to 6000 for 5 minutes.
    }, 20);
}