import i18n from 'lib/i18n';

import { patch } from 'lib/api';
import { successToast, errorToast } from 'utils/toasts';

export default async function updateModel(item, data) {
  try {
    const response = await patch(`/${item.contentType.appLabel}/${item.id}/`, data);

    const { model } = item.contentType;
    const text = i18n.t('toasts:modelUpdated', { model });

    successToast(text);

    return response;
  } catch (error) {
    const text = i18n.t('toasts:error');

    errorToast(text);

    throw error;
  }
}
