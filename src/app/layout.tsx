import type { Metadata } from 'next';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Header from './_components/Header';
import RQProvider from './_components/RQProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Exam CMS STT',
  description: '와우와웅',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ko">
      {process.env.NODE_ENV !== 'production' && (
        <head>
          <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      )}
      <body className="min-w-max">
        <RQProvider>
          <HydrationBoundary state={dehydratedState}>
            {/* header */}
            <div className="bg-base-100 sticky top-0 left-0 z-50 flex w-full flex-row items-center justify-center px-5">
              <Header />
            </div>

            <div className="flex">
              {/* content */}
              <div className="mx-3 my-7 size-full p-3">{children}</div>
            </div>
          </HydrationBoundary>
        </RQProvider>
      </body>
    </html>
  );
}
