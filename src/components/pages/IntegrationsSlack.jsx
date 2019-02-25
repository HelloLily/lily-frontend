import React from 'react';
import { useTranslation } from 'react-i18next';
import SimpleContentBlock from 'components/ContentBlock/SimpleContentBlock';

const IntegrationsSlack = () => {
  const [t] = useTranslation('integrations');

  return (
    <div className="integrations-page">
      <SimpleContentBlock title="Slack">
        <p>
          {t('slackOverview')}
          <br />
          {t('slackOverviewTwo')}
        </p>
      </SimpleContentBlock>
      ;
    </div>
  );
};

export default IntegrationsSlack;
