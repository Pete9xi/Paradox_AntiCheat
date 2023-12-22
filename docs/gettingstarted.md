![Lets Go](https://i.imgur.com/oi5NwOp.png)

!> Before you import the pack, please read below regarding realms. Failing to do so will lead to issues.

## Realms

> - Realms have an issue with the new authentication system which Paradox uses to grant you Paradox-opped access. In this instance, we recommend you use a password, which can be set in config.js. You can then use the following command: `!op mypassword` to grant yourself Paradox-opped rights.

## Required Experimental Flags

Paradox uses the following experimental flags. You need to make sure these are enabled in your world.

- Scripting API
- Molang
- EDU

![ScriptingAPI](https://i.imgur.com/bR8AmXn.png)
![EDU](https://i.imgur.com/djOZoqH.png)

!> The EDU flag is needed for the `!fly` command to work.

## Op Password Configuration

!> It's highly recommended that Realms users make use of the password for granting Paradox op due to bugs within the `isOP()`.

File: `scripts/data/config.js`

Before you import Paradox, you can set a password as seen below. This is recommended for Realm users. If you forget to do this before importing the pack, you will have issues with the realm detecting a change. The steps to get around this are documented elsewhere.

To configure the password, open up config.js and you will see the following code block.

> ```js
> /**
>  * Set your password here.
>  *
>  * This is required for Realm users to gain Paradox-Op.
>  *
>  * Anyone else is welcome to use this if they like but
>  * is not obligated.
>  */
> encryption: {
>     password: "",
> },
> ```

In this example, I am going to set a password of MyPassword123$.

> ```js
> /**
>  * Set your password here.
>  *
>  * This is required for Realm users to gain Paradox-Op.
>  *
>  * Anyone else is welcome to use this if they like but
>  * is not obligated.
>  */
> encryption: {
>     password: "MyPassword123$",
> },
> ```

The next step is to save the file, then re-zip the archive, and rename it with the file extension .mcpack. This can then be imported into Minecraft and applied to the realm.

> Now when I come to running the command on my realm, I will need to execute this command in chat: `!op MyPassword123$`.

## Op Bedrock Dedicated Servers

?> BDS refers to Bedrock Dedicated Servers

BDS users can take full advantage of simply executing `!op` in chat, but the following settings need to be added to the `server.properties` file.

File: `server.properties`

> ```server.properties
> op-permission-level=2
> ```

You should now be able to execute the command and grant yourself Paradox Op. To grant permissions to another player, simply run `!op PlayerName`.

## Ending Notes

You should now have Paradox up and running. The next steps would be to check out all the commands as well as look over the Graphical User Interface for Paradox. To see all commands in chat, run the `!help` command. To access the GUI, run `!paradoxui` and close chat.
