import React from 'react';

import LoadingIndicator from 'components/Utils/LoadingIndicator';

const MyCases = React.lazy(() => import('components/ContentBlock/MyCases'));
const MyDeals = React.lazy(() => import('components/ContentBlock/MyDeals'));
const UnassignedCases = React.lazy(() => import('components/ContentBlock/UnassignedCases'));
const UnassignedDeals = React.lazy(() => import('components/ContentBlock/UnassignedDeals'));
const UnreadEmail = React.lazy(() => import('components/ContentBlock/UnreadEmail'));
const DashboardSettings = React.lazy(() => import('components/ContentBlock/DashboardSettings'));

const Dashboard = () => {
  document.title = 'Dashboard - Lily';

  return (
    <div className="dashboard-widgets">
      <React.Suspense fallback={<LoadingIndicator />}>
        <MyCases />
        <MyDeals />
        <UnassignedCases />
        <UnassignedDeals />
        <UnreadEmail />
        <DashboardSettings />
      </React.Suspense>
    </div>
  );
};

export default Dashboard;
