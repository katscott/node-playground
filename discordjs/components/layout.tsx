import Head from 'next/head';
import styles from './layout.module.css';

export const siteTitle = 'Discord.js Experiment';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </div>
  );
}
