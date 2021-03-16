import { NextApiRequest, NextApiResponse } from 'next';
import Discord, { Permissions } from 'discord.js';

const discordToken = process.env.DISCORD_TOKEN;
const discordGuildId = process.env.DISCORD_GUILD_ID;
const discordAdminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const data = req.body;

    const name = data.name;

    const client = new Discord.Client();
    await client.login(discordToken);

    const guild = await client.guilds.fetch(discordGuildId);

    const role = await guild.roles.create({
      data: {
        name,
      },
    });

    const adminRole = await guild.roles.fetch(discordAdminRoleId);

    const channel = await guild.channels.create(name, {
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: Permissions.FLAGS.VIEW_CHANNEL,
        },
        {
          id: adminRole.id,
          allow: Permissions.FLAGS.VIEW_CHANNEL,
        },
        {
          id: role.id,
          allow: Permissions.FLAGS.VIEW_CHANNEL,
        },
      ],
    });

    res.status(200).json({ channel, role });
  }

  res.status(404);
};
