import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { Command, COMMAND_TAGS } from "../../structures/Command";

export default new Command({
    name: 'delete',
    tag: COMMAND_TAGS.utils,
    description: 'Delete a specified number (min 1, default 10, max 100) of messages in the current text channel',
    userPermissions: [PermissionFlagsBits.Administrator],
    ephemeral: true,
    options: [{
        type: ApplicationCommandOptionType.Number,
        name: 'num',
        description: 'number of messages to delete (min 1, default 10, max 100)',
        min_value: 1,
        max_value: 100,
        required: false,
    }],

    execute: async({ client, interaction, args }) => {
        const { user, channel } = interaction;
        const num = args.get('num')?.value as number || 10;

        await channel.bulkDelete(num, true).then(async (deleted) => {
            interaction.editReply({ content: `**${user.username}**-sama, ${client.user.username} has deleted \`${deleted.size}\` messages` });
        }).catch(err => channel.send({ content: `**${user.username}**-sama, \`${err}\`` }));
    }
});