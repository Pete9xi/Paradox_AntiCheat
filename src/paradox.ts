// Import Customs
import { world, system } from "@minecraft/server";
import { TickFreeze } from "./penrose/tickevent/freeze/freeze.js";
// Import BeforeChat Events
import { BadPackets1 } from "./penrose/beforechatevent/spammer/badpackets_1.js";
import { SpammerA } from "./penrose/beforechatevent/spammer/spammer_a.js";
import { SpammerB } from "./penrose/beforechatevent/spammer/spammer_b.js";
import { SpammerC } from "./penrose/beforechatevent/spammer/spammer_c.js";
import { PrefixCommand } from "./penrose/beforechatevent/chat/prefixcommand.js";
import { ChatFilter } from "./penrose/beforechatevent/chat/chatfilter.js";
import { AntiSpam } from "./penrose/beforechatevent/chat/antispam.js";
// Import Tick Events
import { ServerBan } from "./penrose/tickevent/ban/serverban.js";
import { CrasherA } from "./penrose/tickevent/crasher/crasher_a.js";
import { NamespoofA } from "./penrose/tickevent/namespoof/namespoof_a.js";
import { NamespoofB } from "./penrose/tickevent/namespoof/namespoof_b.js";
import { PlayerPosition } from "./penrose/tickevent/coordinates/playerposition.js";
import { BedrockValidate } from "./penrose/tickevent/bedrock/bedrockvalidate.js";
import { JesusA } from "./penrose/tickevent/jesus/jesus_a.js";
import { NoSlowA } from "./penrose/tickevent/noslow/noslow_a.js";
import { IllegalItemsA } from "./penrose/tickevent/illegalitems/illegalitems_a.js";
import { InvalidSprintA } from "./penrose/tickevent/invalidsprint/invalidsprint_a.js";
import { FlyA } from "./penrose/tickevent/fly/fly_a.js";
import { AntiKnockbackA } from "./penrose/tickevent/knockback/antikb_a.js";
import { NoPerms } from "./penrose/tickevent/noperms/nopermission.js";
import { WorldBorder } from "./penrose/tickevent/worldborder/worldborder.js";
import { Vanish } from "./penrose/tickevent/vanish/vanish.js";
import { Survival } from "./penrose/tickevent/gamemode/survival.js";
import { Adventure } from "./penrose/tickevent/gamemode/adventure.js";
import { Creative } from "./penrose/tickevent/gamemode/creative.js";
import { IllegalItemsC } from "./penrose/tickevent/illegalitems/illegalitems_c.js";
import { OPS } from "./penrose/tickevent/oneplayersleep/oneplayersleep.js";
import { Hotbar } from "./penrose/tickevent/hotbar/hotbar.js";
import { VerifyPermission } from "./penrose/tickevent/noperms/verifypermission.js";
import { BadPackets2 } from "./penrose/tickevent/badpackets2/badpackets2.js";
import { ClearLag } from "./penrose/tickevent/clearlag/clearlag.js";
import { AntiFallA } from "./penrose/tickevent/antifalla/antifall_a.js";
import { AutoBan } from "./penrose/tickevent/ban/autoban.js";
// Import BlockBreak Events
import { XrayA } from "./penrose/blockbreakevent/xray/xray_a.js";
import { NukerA } from "./penrose/blockbreakevent/nuker/nuker_a.js";
// Import PlayerSpawn Events
import { onJoin } from "./penrose/playerspawnevent/onjoin/onjoin.js";
import { GlobalBanList } from "./penrose/playerspawnevent/ban/globalbanlist.js";
import { hashCode } from "./penrose/playerspawnevent/hash/hash.js";
import { onJoinrules } from "./gui/playerspawnevent/rules/rules.js";
// Import BlockPlace Events
import { ScaffoldA } from "./penrose/blockplaceevent/scaffold/scaffold_a.js";
import { IllegalItemsB } from "./penrose/blockplaceevent/illegalitems/illegalitems_b.js";
import { ReachA } from "./penrose/blockplaceevent/reach/reach_a.js";
// Import EntityHit Events
import { ReachB } from "./penrose/entityhitevent/reach_b.js";
import { KillAura } from "./penrose/entityhitevent/killaura.js";
// Import WorldInitialize Events
import { Registry } from "./penrose/worldinitializeevent/registry.js";
// Import System Events
import { WatchDog } from "./penrose/systemevent/watchdog.js";

// Self explanatory

// WorldInitialize Events
Registry();

// BeforeChat Events
BadPackets1();
SpammerA();
SpammerB();
SpammerC();
AntiSpam();
PrefixCommand();
ChatFilter();

// Tick Events
ClearLag();
BadPackets2();
VerifyPermission;
OPS();
Hotbar();
NoPerms;
PlayerPosition;
Vanish;
IllegalItemsC();
Survival();
Adventure();
Creative();
WorldBorder();
ServerBan;
CrasherA();
NamespoofA();
NamespoofB();
BedrockValidate();
JesusA();
NoSlowA();
IllegalItemsA();
InvalidSprintA();
FlyA();
AntiKnockbackA();
AntiFallA();
AutoBan();

/**
 * Freeze Check
 */
system.runInterval(() => {
    let hastag: boolean;
    // run as each player
    const players = world.getPlayers();
    for (let player of players) {
        try {
            hastag = player.hasTag("freeze");
        } catch (error) {}
        if (hastag) {
            TickFreeze(player);
            hastag = null;
        }
    }
}, 60); // Executes every 3 seconds

// BlockBreak Events
XrayA();
NukerA();

// playerSpawn Events
onJoin();
GlobalBanList();
hashCode();
onJoinrules(); // GUI
// BlockPlace Events
ScaffoldA();
IllegalItemsB();
ReachA();

// EntityHit Events
ReachB();
KillAura();

// System Events
WatchDog();
