import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightbrown px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Welcome to Ebarza Staff</title>
      </Head>
      <main className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-white">Welcome to Ebarza Staff</h1>
        <p className="text-lg sm:text-xl text-white mt-4">The website toolkit is under development process.</p>
      </main>
    </div>
  );
}
