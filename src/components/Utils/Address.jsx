import React from 'react';

const Address = ({ address }) => (
  <div>
    {address.address}

    {(address.postalCode || address.city) && (
      <div>
        {address.postalCode}

        {address.postalCode && address.city && <span>, </span>}

        {address.city}
      </div>
    )}

    <div>{address.countryDisplay}</div>
  </div>
);

export default Address;
