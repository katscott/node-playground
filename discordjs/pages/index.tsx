import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { GetServerSideProps } from 'next';
import Discord from 'discord.js';
import { parseCookies } from 'nookies';

const discordToken = process.env.DISCORD_TOKEN;

export default function Home({
  discordUser,
}: {
  discordUser: {
    id: string;
    username: string;
    discriminator: string;
  };
}) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        {(!discordUser && <a href="/discord/auth">invite me</a>) || (
          <>
            <span>Discord ID: {discordUser.id}</span>
            <br />
            <span>
              Discord Username: {discordUser.username}#
              {discordUser.discriminator}
            </span>
          </>
        )}
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);

  let discordUser: Discord.User = null;

  if (cookies.user) {
    const client = new Discord.Client();
    await client.login(discordToken);
    discordUser = await client.users.fetch(cookies.user);
  }

  return {
    props: {
      discordUser: discordUser ? {
        id: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
      } : null,
    },
  };
};
