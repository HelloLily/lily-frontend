export default function makeNotification({ params, destination, icon }) {
  const { name, number, id } = params;

  let notification;

  // If there is no name available, use the phone number in the title of the notification
  if (name !== '') {
    notification = new Notification(`${name} calling`, { body: number, icon });
  } else {
    notification = new Notification(`${number} calling`, { body: '', icon });
  }

  setTimeout(() => {
    notification.close();
  }, 10000);

  // ga('send', 'event', 'Caller info', 'Answer', 'Incoming call');

  notification.onclick = () => {
    switch (destination) {
      case 'account':
        window.open(`/accounts/${id}`, '_blank');
        break;
      case 'contact':
        window.open(`/contacts/${id}`, '_blank');
        break;
      case 'create':
        // There is no way to know if an account or contact needs to be created. As it's more
        // likely an account needs to be created, this links to account.create.
        window.open(`/accounts/create?name=${name}&phoneNumber=${number}`, '_blank');
        break;
      default:
        break;
    }

    notification.close();

    // Track clicking on the caller info button in Segment.
    window.analytics.track('caller-info-click', {
      phone_number: number
    });

    // Track clicking on the caller notification in Google analytics and Segment.
    // ga('send', 'event', 'Caller info', 'Open', 'Popup');
  };
}
