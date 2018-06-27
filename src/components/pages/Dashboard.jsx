import React from 'react';

import MyCases from 'components/ContentBlock/MyCases';
import MyDeals from 'components/ContentBlock/MyDeals';
import UnassignedCases from 'components/ContentBlock/UnassignedCases';
import UnassignedDeals from 'components/ContentBlock/UnassignedDeals';

const Dashboard = () => (
  <div className="dashboard-widgets">
    <MyCases />
    <MyDeals />
    <UnassignedCases />
    <UnassignedDeals />
  </div>
);

export default Dashboard;
