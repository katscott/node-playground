import { NextApiRequest, NextApiResponse } from 'next';
import Discord from 'discord.js';

const discordToken = process.env.DISCORD_TOKEN;
const discordGuildId = process.env.DISCORD_GUILD_ID;
const discordWelcomeChannelId = process.env.DISCORD_WELCOME_CHANNEL_ID;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const data = req.body;

    const email = data.email;

    if (!email) {
        res.status(400);
        return
    }

    const client = new Discord.Client();
    await client.login(discordToken);

    const guild = await client.guilds.fetch(discordGuildId);
    const channel = await guild.channels.cache.get(discordWelcomeChannelId);
    const invite = await channel.createInvite({
      maxUses: 1,
    });

    // generated invite link with code
    res.status(200).json({ invite: `https://discord.gg/${invite.code}` });
  }

  res.status(404);
};
