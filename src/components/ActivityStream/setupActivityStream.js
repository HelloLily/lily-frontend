import { compareDesc, parseISO } from 'date-fns';

import { get } from 'lib/api';
import Note from 'models/Note';
import Case from 'models/Case';
import Deal from 'models/Deal';
import EmailMessage from 'models/EmailMessage';
import setupChanges from './setupChanges';

export default async function setupActivityStream(
  object,
  dateStart = null,
  dateEnd = null,
  parentObject = null
) {
  const { model } = object.contentType;
  const activityStream = [];

  // let dateQuery = '';
  let emailDateQuery = '';

  if (dateStart && dateEnd) {
    // dateQuery = ` AND modified:[${dateStart} TO ${dateEnd}]`;
    emailDateQuery = `sent_date:[${dateStart} TO ${dateEnd}]`;
  }

  const getNotes = async item => {
    const url = `/${item.contentType.appLabel}/${item.id}/notes`;
    const response = await get(url, { filterDeleted: false });

    return response.results;
  };

  const getItemNotes = async (contentType, ids) => {
    const params = {
      gfkContentType: contentType,
      gfkObjectId__in: ids,
      ordering: '-date'
    };
    const response = await Note.query(params);

    return response.results;
  };

  const getChanges = async () => {
    const url = `/${object.contentType.appLabel}/${object.id}/changes`;
    const response = await get(url, { filterDeleted: false });

    return response.results;
  };

  const getCases = async () => {
    const response = await Case.query({ [`${model}.id`]: object.id });

    return response.results;
  };

  const getDeals = async () => {
    const response = await Deal.query({ [`${model}.id`]: object.id });

    return response.results;
  };

  const getCalls = async () => {
    const url = `/${object.contentType.appLabel}/${object.id}/calls`;
    const response = await get(url, { filterDeleted: false });

    return response.results;
  };

  const getEmailMessages = async () => {
    const params = {
      query: emailDateQuery
    };

    if (model === 'account') {
      params.accountRelated = object.id;
    } else {
      params.contactRelated = object.id;
    }

    const response = await EmailMessage.query(params);

    return response.results;
  };

  const getTimeLogs = async () => {
    const url = `/${object.contentType.appLabel}/${object.id}/timelogs`;
    const response = await get(url, { filterDeleted: false });

    return response.results;
  };

  const notes = await getNotes(object);

  notes.forEach(note => {
    activityStream.push(note);
  });

  const changeItems = await getChanges();
  const changes = setupChanges(changeItems);

  changes.forEach(change => {
    activityStream.push(change);
  });

  if (['account', 'contact'].includes(model)) {
    let cases = await getCases();

    if (parentObject && parentObject.contentType.model === 'case') {
      // Filter out the object that's being viewed if we're dealing with a child activity stream.
      cases = cases.filter(caseObj => caseObj.id !== parentObject.id);
    }

    cases.forEach(async caseObj => {
      caseObj.notes = [];

      activityStream.push(caseObj);
    });

    const caseIds = cases.map(caseObj => caseObj.id);
    const caseNotes = await getItemNotes('case', caseIds);

    cases.forEach(caseObj => {
      caseNotes.forEach(caseNote => {
        if (caseNote.gfkObjectId === caseObj.id) {
          caseObj.notes.push(caseNote);
        }
      });
    });

    let deals = await getDeals();

    if (parentObject && parentObject.contentType.model === 'case') {
      // Filter out the object that's being viewed if we're dealing with a child activity stream.
      deals = deals.filter(deal => deal.id !== parentObject.id);
    }

    deals.forEach(async deal => {
      deal.notes = [];

      activityStream.push(deal);
    });

    const dealIds = deals.map(deal => deal.id);
    const dealNotes = await getItemNotes('deal', dealIds);

    deals.forEach(deal => {
      dealNotes.forEach(dealNote => {
        if (dealNote.gfkObjectId === deal.id) {
          deal.notes.push(dealNote);
        }
      });
    });

    const calls = await getCalls();

    calls.forEach(async call => {
      call.notes = [];

      activityStream.push(call);
    });

    const callIds = calls.map(call => call.id);
    const callNotes = await getItemNotes('callrecord', callIds);

    calls.forEach(call => {
      callNotes.forEach(callNote => {
        if (callNote.gfkObjectId === call.id) {
          call.notes.push(callNote);
        }
      });
    });

    const emailMessages = await getEmailMessages();

    emailMessages.forEach(emailMessage => {
      activityStream.push(emailMessage);
    });

    const attachmentPromises = [];

    emailMessages.forEach(emailMessage => {
      if (!emailMessage.isDraft) {
        if (emailMessage.hasAttachment) {
          const promise = EmailMessage.attachments(emailMessage.id);
          attachmentPromises.push(promise);
        }
      }
    });

    const attachmentResponses = await Promise.all(attachmentPromises);

    attachmentResponses.forEach(response => {
      emailMessages.forEach(emailMessage => {
        if (emailMessage.id === response.results[0].message) {
          emailMessage.attachments = response.results;
        }
      });
    });
  }

  if (['case', 'deal'].includes(model)) {
    const timeLogs = await getTimeLogs(object);

    timeLogs.forEach(timeLog => {
      activityStream.push(timeLog);
    });
  }

  const options = [
    {
      id: null,
      appLabel: 'all',
      model: 'all'
    }
  ];

  // Not all items have use the same property to sort on date.
  // Add an extra property which allows the activity stream to be sorted.
  activityStream.forEach(item => {
    const itemModel = item.contentType.model;

    if (itemModel === 'emailmessage') {
      item.activitySortDate = item.sentDate;
    } else if (['note', 'change'].includes(itemModel)) {
      item.activitySortDate = item.created;
    } else if (itemModel === 'callrecord') {
      item.activitySortDate = item.start;
    } else if (itemModel === 'timelog') {
      item.activitySortDate = item.date;
    } else {
      item.activitySortDate = item.modified;
    }

    const optionExists = options.some(option => option.id === item.contentType.id);

    if (!optionExists) {
      // Keep track of the available filtering options.
      options.push(item.contentType);
    }

    // if (item.hasOwnProperty('senderEmail')) {
    //   const exists = userIds.find(user => user.email === item.senderEmail);

    //   if (!exists) {
    //     const user = await User.get(item.assignedTo.id);

    //     users.push(user);
    //   }

    //   item.user = exists;
    // }
  });

  const sortedActivityStream = activityStream.sort((item, item2) =>
    compareDesc(parseISO(item.activitySortDate), parseISO(item2.activitySortDate))
  );

  return { activityStream: sortedActivityStream, options };
}
