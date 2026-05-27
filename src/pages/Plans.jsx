import React from 'react';
import { Outlet } from 'react-router-dom';

import Navigation from '../components/Plans/Navigation';
import Footer from '../components/Plans/Footer';

/**
 * Shell for authenticated app area. Plan data (usePlans) lives under PlansDataLayout
 * so /plans/billing does not call plan APIs without a subscription.
 */
const Plans = () => {
  return (
    <div className="flex min-h-svh w-full bg-slate-50">
      <div className="fixed inset-y-0 left-0 w-60 border-r border-white/10 bg-[#142725]">
        <Navigation />
      </div>
      <main className="flex-1 pl-60">
        <div className="mx-auto flex h-full min-h-svh max-w-7xl flex-col justify-between p-12 lg:max-w-7xl">
          <Outlet />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Plans;
