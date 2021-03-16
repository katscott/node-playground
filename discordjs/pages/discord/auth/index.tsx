import { GetServerSideProps } from 'next';
import DiscordOauth2 from 'discord-oauth2';
import crypto from 'crypto';

const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;

export default function Redirect() {
  return <main></main>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const oauth = new DiscordOauth2({
    clientId: discordClientId,
    clientSecret: discordClientSecret,
    redirectUri: 'http://localhost:3000/discord/auth/redirect',
  });

  // to auto-join the guild, guilds.join scope required, otherwise oauth can
  // only do interactions after join via invite link
  const authUrl = oauth.generateAuthUrl({
    scope: ['identify', 'guilds', 'guilds.join'],
    state: crypto.randomBytes(16).toString('hex'),
  });

  const response = {
    redirect: {
      destination: authUrl,
      permanent: false,
    },
  };

  return response;
};
