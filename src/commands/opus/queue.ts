import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, PermissionFlagsBits } from "discord.js";
import { ExtendedClient } from "../../structures/Client";
import { Command, COMMAND_TAGS } from "../../structures/Command";
import { Track } from "../../structures/opus/Track";
import { BaseEmbed, formatDuration, generateInteractionComponentId } from "../../structures/Utils";

export enum BUTTON_QUEUE_EMBED {
    start = 'queueEmbed_start',
    back = 'queueEmbed_back',
    next = 'queueEmbed_next',
    end = 'queueEmbed_end',
    done = 'queueEmbed_done',
}

export const QUEUE_EMBED_PAGE_STEP = 7;

export default new Command({
    name: 'queue',
    tag: COMMAND_TAGS.music,
    description: 'Display the current queue',
    userPermissions: [PermissionFlagsBits.SendMessages],
    
    execute: async({ client, interaction, args }) => {
        let currPage = 0;
        const mPlayer = client.music.get(interaction.guildId);
        mPlayer.currQueuePage.set(interaction.user.id, currPage);

        const queueEmbed = await generateQueueEmbed(currPage, mPlayer.queue, client);
        
        const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId(generateInteractionComponentId(BUTTON_QUEUE_EMBED.start, interaction.user.id))
                    .setLabel('<<')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(generateInteractionComponentId(BUTTON_QUEUE_EMBED.back, interaction.user.id))
                    .setLabel('<')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(generateInteractionComponentId(BUTTON_QUEUE_EMBED.next, interaction.user.id))
                    .setLabel('>')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(generateInteractionComponentId(BUTTON_QUEUE_EMBED.end, interaction.user.id))
                    .setLabel('>>')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(generateInteractionComponentId(BUTTON_QUEUE_EMBED.done, interaction.user.id))
                    .setLabel('Done')
                    .setStyle(ButtonStyle.Danger),

            ]);

        interaction.followUp({ embeds: [queueEmbed], components: [actionRow] });
    }
});

/* This function is for generating an embed with the queue information */
export async function generateQueueEmbed(i: number, queue: Track[], client: ExtendedClient) {
    let info: String;
    let start = QUEUE_EMBED_PAGE_STEP*i+1;
    let end = start+QUEUE_EMBED_PAGE_STEP;
    end = end > queue.length ? queue.length : end;

    const next = queue.slice(start, end);
    // checks if there's anything next in queue
    if (next.length !== 0){
        let j = start;
        info = next.map(track => `${++j}) [${track.title}](${track.url}) | \`${formatDuration(track.duration)}\` | requested by **${track.requester.username}**-sama`).join("\n\n");
    } // end of if
    else { info = "Currently no track is next in queueヾ (= `ω´ =) ノ”"; } // else next in queue is empty

    // construct the embed(s)
    if(i==0 || !info.startsWith("Currently")){
        const embed = BaseEmbed()
            .setTitle(`Page ${i+1}/${Math.ceil(queue.length/QUEUE_EMBED_PAGE_STEP)}`)
            .setDescription(`⚓ Currently playing ▶️\n [${queue[0].title}](${queue[0].url}) | \`${formatDuration(queue[0].duration)}\` | requested by **${queue[0].requester.username}**-sama\n\n⚓ Next in queue ⏭️\n${info}`);
        return embed;
    }
    
} // end of gerenateQueueEmbed(...) helper function