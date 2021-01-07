import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies, setCookie } from 'nookies';

export default function Home({ cookies }) {
  const clientId = process.env.slackClientId;
  const redirectUri = encodeURIComponent(process.env.slackRedirectUri);

  const slackUrl = `https://slack.com/oauth/v2/authorize?user_scope=identity.basic,identity.avatar&client_id=${clientId}&redirect_uri=${redirectUri}`;

  const { slackId } = cookies;

  return (
    <div>
      <Head>
        <title>Slack Sign In Prototype</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Slack Connect</h1>

        <div>
          {(!slackId && (
            <a href={slackUrl}>
              <img
                alt="Sign in with Slack"
                height="40"
                width="172"
                src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
              />
            </a>
          )) || <span>Slack ID: {slackId}</span>}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  return { props: { cookies } };
};
