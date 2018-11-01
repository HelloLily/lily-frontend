import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import { successToast, errorToast } from 'utils/toasts';
import BlockUI from 'components/Utils/BlockUI';
import FormSection from 'components/Utils/FormSection';
import Account from 'models/Account';
import Contact from 'models/Contact';

class TokenForm extends Component {
  constructor(props) {
    super(props);

    this.fileAccountsRef = React.createRef();
    this.fileContactsRef = React.createRef();

    document.title = 'Import - Lily';
  }

  importAccounts = async () => {
    const { t } = this.props;
    const data = { csv: this.fileAccountsRef.current.files[0] };

    try {
      await Account.import(data);

      successToast(t('toasts:accountImportSuccess'));
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  importContacts = async () => {
    const { t } = this.props;
    const data = { csv: this.fileContactsRef.current.files[0] };

    try {
      await Contact.import(data);

      successToast(t('toasts:contactImportSuccess'));
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  render() {
    const { t } = this.props;

    return (
      <BlockUI blocking={false}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">Import accounts & contacts</div>
            </div>

            <div className="content-block-content">
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
                    id="fileAccounts"
                    type="file"
                    accept="text/csv"
                    ref={this.fileAccountsRef}
                  />

                  {/* {errors.fileAccounts && <div className="error-message">{errors.fileAccounts}</div>} */}

                  <p className="text-muted small m-t-5">Maximum file size is 2mb.</p>
                </div>

                <button className="hl-primary-btn-blue m-t-10" onClick={this.importAccounts}>
                  <FontAwesomeIcon icon="upload" /> Import
                </button>
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
                    <strong>phone number</strong>,<strong>mobile</strong>,<strong>address</strong>,
                    <strong>postal code</strong>,<strong>city</strong>,<strong>twitter</strong>,
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
                    id="fileContacts"
                    type="file"
                    accept="text/csv"
                    ref={this.fileContactsRef}
                  />

                  {/* {errors.fileContacts && <div className="error-message">{errors.fileContacts}</div>} */}

                  <p className="text-muted small m-t-5">Maximum file size is 2mb.</p>
                </div>

                <button className="hl-primary-btn-blue m-t-10">
                  <FontAwesomeIcon icon="upload" /> Import
                </button>
              </FormSection>
            </div>
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default withNamespaces(['preferences', 'toasts'])(withContext(TokenForm));
