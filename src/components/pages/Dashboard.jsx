import React from 'react';

import MyCases from 'components/Widget/MyCases';
import MyDeals from 'components/Widget/MyDeals';
import UnassignedCases from 'components/Widget/UnassignedCases';
import UnassignedDeals from 'components/Widget/UnassignedDeals';

const Dashboard = () => (
  <div className="dashboard-widgets">
    <MyCases />
    <MyDeals />
    <UnassignedCases />
    <UnassignedDeals />
  </div>
);

export default Dashboard;
