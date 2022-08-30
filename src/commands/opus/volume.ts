import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { Command, COMMANDS, COMMAND_TAGS } from "../../structures/Command";

export default new Command({
    name: COMMANDS.volume,
    tag: COMMAND_TAGS.music,
    description: `Change the currently playing track or the player's volume (min 0, default 1, max 10)`,
    userPermissions: [PermissionFlagsBits.SendMessages],
    options: [
    {
        type: ApplicationCommandOptionType.Number,
        name: 'value',
        description: 'volume value (min 0, default 1, max 10)',
        min_value: 0,
        max_value: 10,
        required: false,
    },
    {
        type: ApplicationCommandOptionType.Number,
        name: 'volume_type',
        description: 'change the volume of only the current track (default) or the player (all tracks)',
        choices: [
            { name: 'track', value: 1 },
            { name: 'player', value: 2 },
        ],
        required: false,
    }
    ],

    execute: async({ client, interaction, args }) => {
        const mPlayer = client.music.get(interaction.guildId);

        const value = args.get('value')?.value as number || 1;
        const type = args.get('volume_type')?.value as number || 1;
        let extraReply = '';

        if(type == 2) { 
            mPlayer.volume = value;
            extraReply = ` \`player's\``
        }
        mPlayer.queue[0].setVolume(value);

        mPlayer.updatePlayingStatusMsg();
        interaction.followUp({ content: `**${interaction.user.username}**-sama, ${client.user.username} has set the${extraReply} volume to \`${mPlayer.queue[0].getVolume()}\`` });
    }
});