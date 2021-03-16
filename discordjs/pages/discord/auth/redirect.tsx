import { GetServerSideProps } from 'next';
import DiscordOauth2 from 'discord-oauth2';
import { setCookie } from 'nookies';
import Discord from 'discord.js';

const discordToken = process.env.DISCORD_TOKEN;
const discordGuildId = process.env.DISCORD_GUILD_ID;
const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;

export default function Redirect() {
  return <main></main>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const code = query.code;

  const response = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  if (!code) {
    return response;
  }

  const oauth = new DiscordOauth2({
    clientId: discordClientId,
    clientSecret: discordClientSecret,
    redirectUri: 'http://localhost:3000/discord/auth/redirect',
  });

  const token = await oauth.tokenRequest({
    code: code as string,
    scope: 'identify guilds',
    grantType: 'authorization_code',
  });

  // is there equivalent of this in discord.js?
  const resp = await fetch('https://discord.com/api/users/@me', {
		headers: {
			authorization: `${token.token_type} ${token.access_token}`,
		},
	});

  const user: { id: string; } = await resp.json();

  setCookie(context, 'user', user.id, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  const client = new Discord.Client();
    await client.login(discordToken);
  const userObj = await client.users.fetch(user.id);
  
  const guild = await client.guilds.fetch(discordGuildId);
  const member = await guild.addMember(userObj, { accessToken: token.access_token });

  // not sure this would be great if there is a lot of roles (may need to store the role ids)
  await guild.roles.fetch();
  const role = guild.roles.cache.find((role) => role.name == 'test');

  await member.roles.add(role);

  return response;
};
