import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import withContext from 'src/withContext';
import { successToast, errorToast } from 'utils/toasts';
import BlockUI from 'components/Utils/BlockUI';
import FeatureBlock from 'components/Utils/FeatureBlock';
import FormSection from 'components/Form/FormSection';
import Utils from 'models/Utils';

class Import extends Component {
  constructor(props) {
    super(props);

    this.accountFileRef = React.createRef();

    this.state = {
      accountError: null,
      contactError: null
    };

    document.title = 'Import - Lily';
  }

  importAccounts = async () => {
    const { t } = this.props;

    this.setState({ accountError: null });

    const csv = this.accountFileRef.current.files[0];
    const formData = new FormData();

    formData.append('csv', csv);
    formData.append('import_type', 'account');

    try {
      await Utils.import(formData);

      successToast(t('toasts:preferences.accountImportSuccess'));
    } catch (error) {
      this.setState({ accountError: error.data.importFile });
      errorToast(t('toasts:preferences.accountImportError'));
    }
  };

  importContacts = async () => {
    const { t } = this.props;

    this.setState({ contactError: null });

    const csv = this.contactFileRef.current.files[0];
    const formData = new FormData();

    formData.append('csv', csv);
    formData.append('import_type', 'contact');

    try {
      await Utils.import(formData);

      successToast(t('toasts:preferences.contactImportSuccess'));
    } catch (error) {
      this.setState({ contactError: error.data.importFile });
      errorToast(t('toasts:preferences.accountImportError'));
    }
  };

  render() {
    const { accountError, contactError } = this.state;
    const { t } = this.props;

    return (
      <BlockUI blocking={false}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">Import accounts & contacts</div>
            </div>

            <div className="content-block-content">
              <FeatureBlock needsAdmin>
                <FormSection header="Import accounts">
                  <p>{t('preferences:import.accountIntro')}</p>
                  <ul className="hl-instruction-list">
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsOne')}
                    </li>
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsTwo')}:<strong>company name</strong>
                    </li>
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsThree')}:<strong>website</strong>,
                      <strong>email address</strong>,<strong>phone number</strong>,
                      <strong>address</strong>,<strong>postal code</strong>,<strong>city</strong>,
                      <strong>twitter</strong>.
                    </li>
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsFourAccount')}
                    </li>
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsFive')}
                    </li>
                  </ul>

                  <div className="m-t-15">
                    <input
                      id="accountFile"
                      type="file"
                      accept="text/csv"
                      ref={this.accountFileRef}
                    />
                  </div>

                  <button className="hl-primary-btn-blue m-t-10" onClick={this.importAccounts}>
                    <FontAwesomeIcon icon={['far', 'upload']} /> Import
                  </button>

                  <div className="m-t-10">
                    {accountError && <div className="error-message">{accountError}</div>}
                  </div>
                </FormSection>

                <FormSection header="Import contacts">
                  <p>{t('preferences:import.contactIntro')}</p>
                  <ul className="hl-instruction-list">
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsOne')}
                    </li>
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsTwo')}:<strong>first name</strong>,
                      <strong>last name</strong>
                    </li>
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsThree')}:<strong>email address</strong>,
                      <strong>phone number</strong>,<strong>mobile</strong>,<strong>address</strong>
                      ,<strong>postal code</strong>,<strong>city</strong>,<strong>twitter</strong>,
                      <strong>linkedin</strong>,<strong>company name</strong>.
                    </li>
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsFourContact')}
                    </li>
                    <li className="hl-instruction-list-item">
                      {t('preferences:import.instructionsFive')}
                    </li>
                  </ul>

                  <div className="m-t-15">
                    <input
                      id="contactFile"
                      type="file"
                      accept="text/csv"
                      ref={this.contactFileRef}
                    />
                  </div>

                  <button className="hl-primary-btn-blue m-t-10" onClick={this.importContacts}>
                    <FontAwesomeIcon icon={['far', 'upload']} /> Import
                  </button>

                  <div className="m-t-10">
                    {contactError && <div className="error-message">{contactError}</div>}
                  </div>
                </FormSection>
              </FeatureBlock>
            </div>
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default withTranslation(['preferences', 'toasts'])(withContext(Import));
