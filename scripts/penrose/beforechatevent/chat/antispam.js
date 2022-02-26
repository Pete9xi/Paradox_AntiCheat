import * as Minecraft from "mojang-minecraft";

const World = Minecraft.world;

const spamCheck = new Map();

// Custom object and property
const _player = {
    count: 0,
    spam: 0,
    check: 0
};

function timer() {
    _player.count = 0;
}

const AntiSpam = () => {
    World.events.beforeChat.subscribe(msg => {
        // Store player object
        let player = msg.sender;
        let message = msg.message;

        // Increment
        _player.count++

        // Specific to Horion
        if (message.includes("the best minecraft bedrock utility mod")) {
            _player.check++;
        }

        if (!spamCheck.get(player.nameTag)) {
            spamCheck.set(player.nameTag, message);
        } else {
            let oldChat = spamCheck.get(player.nameTag)
            if (oldChat === message) {
                _player.spam++;
                try {
                    player.runCommand(`tellraw "${player.nameTag}" {"rawtext":[{"text":"§r§4[§6Paradox§4]§r "},{"text":"Do not spam chat!"}]}`);
                } catch (error) {}
                msg.cancel = true;
            } else if (_player.check >= 2) {
                msg.cancel = true;
                _player.spam = 10;
                _player.check = 0;
            } else {
                _player.spam = 0;
            }
            if (_player.spam >= 10) {
                let tags = player.getTags();
                // This removes old ban tags
                tags.forEach(t => {
                    if(t.startsWith("Reason:")) {
                        player.removeTag(t.slice(1));
                    }
                    if(t.startsWith("By:")) {
                        player.removeTag(t.slice(1));
                    }
                });
                try {
                    player.runCommand(`clear "${player.nameTag}"`);
                } catch (error) {}
                try {
                    player.runCommand(`tag "${player.nameTag}" add "Reason:Spamming"`);
                    player.runCommand(`tag "${player.nameTag}" add "By:Paradox"`);
                    player.addTag('isBanned');
                } catch (error) {
                    player.triggerEvent('paradox:kick');
                }
            }
            spamCheck.set(player.nameTag, message);
        }

        if (_player.count >= 2) {
            msg.cancel = true
            try {
                player.runCommand(`tellraw "${player.nameTag}" {"rawtext":[{"text":"§r§4[§6Paradox§4]§r "},{"text":"You are sending too many messages! Please slow down!"}]}`);
            } catch (error) {}
            return;
        }
    });
};

export { AntiSpam, timer };