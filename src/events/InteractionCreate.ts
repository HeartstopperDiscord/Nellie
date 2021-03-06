import { client } from "../structures/Client";
import { DiscordEvent } from "../structures/DiscordEvent";
import { SlashCommand } from "../structures/SlashCommand";

const InteractionCreate = new DiscordEvent("interactionCreate")

InteractionCreate.handle = (interaction) => {
     if (interaction.isCommand()) {
          const command = client.commands.get(interaction.commandName)

          if (!command) return

          const args = command.arguments.map((x: any) => {
               //@ts-expect-error Sorry, TS being an ass
               return interaction.options["get" + SlashCommand.NiceArgumentNames[x.type]](x.name, false)
          })

          command.execute(args, interaction)
     } else if (interaction.isUserContextMenu()) {
          client.contexts.user.get(interaction.commandName)?.handle(interaction)
     }
     /**
      * `customId` only exists on Button Interactions etc.
      *  So by checking if it has the property, we are basically checking if it's a "that type" of interaction
      *  But typescript believes that this is an "unknown" Interaction, so it says customId will never exist
      */
     //@ts-expect-error `customId` only exists on Button Interactions
     else if (interaction.customId) {
          //@ts-expect-error `customId` only exists on Button Interactions
          client.interactions.get(interaction.customId.split("-")[0])?.handle(interaction)
     }
}

export default InteractionCreate