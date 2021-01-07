import { GetServerSideProps } from 'next';
import axios from 'axios';
import { setCookie } from 'nookies';

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

  const clientId = process.env.slackClientId;
  const clientSecret = process.env.slackClientSecret;
  const redirectUri = encodeURIComponent(process.env.slackRedirectUri);

  const oauthUrl = `https://slack.com/api/oauth.v2.access?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&redirect_uri=${redirectUri}`;

  const oauth = await axios.get<{
    ok: boolean;
    authed_user: { id: string; access_token: string; };
  }>(oauthUrl);

  if (!oauth.data.ok) return response;
  
  setCookie(context, 'slackId', oauth.data.authed_user.id, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  // const access_token = oauth.data.authed_user.access_token;

  // const identity = await axios.get<{
  //   ok: boolean;
  //   user: { id: string };
  // }>('https://slack.com/api/users.identity', {
  //   headers: {
  //     Authorization: `Bearer ${access_token}`,
  //   },
  // });

  // setCookie(context, 'slack_id', identity.data.user.id, {
  //   maxAge: 30 * 24 * 60 * 60,
  //   path: '/',
  // });

  return response;
};
