import React from 'react';

const LilyCurrency = ({ value, currency }) => {
  const locale = navigator.language;
  const formatted = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

  return <span className="lily-currency">{formatted}</span>;
};

export default LilyCurrency;
