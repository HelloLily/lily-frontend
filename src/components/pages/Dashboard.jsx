import React from 'react';

import MyCases from 'components/ContentBlock/MyCases';
import MyDeals from 'components/ContentBlock/MyDeals';
import UnassignedCases from 'components/ContentBlock/UnassignedCases';
import UnassignedDeals from 'components/ContentBlock/UnassignedDeals';
import UnreadEmail from 'components/ContentBlock/UnreadEmail';

const Dashboard = () => {
  document.title = 'Dashboard - Lily';

  return (
    <div className="dashboard-widgets">
      <MyCases />
      <MyDeals />
      <UnassignedCases />
      <UnassignedDeals />
      <UnreadEmail />
    </div>
  );
};

export default Dashboard;
