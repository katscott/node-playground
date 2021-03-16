import { NextApiRequest, NextApiResponse } from 'next';
import Discord, { Permissions, RoleData } from 'discord.js';

const discordToken = process.env.DISCORD_TOKEN;
const discordGuildId = process.env.DISCORD_GUILD_ID;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id } = req.query;

    const data = req.body;
    const roleId = data.roleId;

    const client = new Discord.Client();
    await client.login(discordToken);

    const guild = await client.guilds.fetch(discordGuildId);

    const member = await guild.members.fetch(id as string);

    if (!member) res.status(404);

    const role = await guild.roles.fetch(roleId);

    if (!role) res.status(500);

    await member.roles.add(role);

    res.status(200).json({ message: "success" });
  }

  res.status(404);
};
