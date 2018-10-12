export default function makeNotification({ params, destination, icon }) {
  let notification;

  // If there is no name available, use the phone number in the title of the notification
  if (params.name !== '') {
    notification = new Notification(`${params.name} calling`, { body: params.number, icon });
  } else {
    notification = new Notification(`${params.number} calling`, { body: '', icon });
  }

  setTimeout(() => {
    notification.close();
  }, 10000);

  // ga('send', 'event', 'Caller info', 'Answer', 'Incoming call');

  notification.onclick = () => {
    switch (destination) {
      case 'account':
        window.open(`/accounts/${params.id}`, '_blank');
        break;
      case 'contact':
        window.open(`/contacts/${params.id}`, '_blank');
        break;
      case 'create':
        // There is no way to know if an account or contact needs to be created. As it's more
        // likely an account needs to be created, this links to account.create.
        window.open(`/accounts/create?name=${params.name}&phoneNumber=${params.number}`, '_blank');
        break;
      default:
        break;
    }

    notification.close();

    // Track clicking on the caller notification in Google analytics and Segment.
    // ga('send', 'event', 'Caller info', 'Open', 'Popup');

    // analytics.track('caller-notification-click', {
    //   'phone_number': data.params.number
    // });
  };
}
