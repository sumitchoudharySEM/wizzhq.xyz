export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Suspense } from 'react';
import Home from './homepage';

export default function Page() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}