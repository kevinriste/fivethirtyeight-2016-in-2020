import Head from 'next/head';
import MapChart from 'components/MapChart';

export default function Home() {
  return (
    <>
      <Head>
        <title>{'2020 Election Forecast'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          {'Who will win the presidency?'}
        </h1>
        <div>
          <MapChart />
        </div>
      </main>
    </>
  );
}
