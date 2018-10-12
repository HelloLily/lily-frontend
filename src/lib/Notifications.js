import makeNotification from 'utils/makeNotification';
import Socket from './Socket';

class Notifications {
  constructor() {
    this.sendNotification = false;
  }

  init() {
    this.notificationWindowCheck();

    Socket.bind('notification', data => {
      this.notificationWindowCheck();

      if (this.sendNotification && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          makeNotification(data);
        } else if (Notification.permission !== 'denied') {
          // If the user has not already accepted or denied notifications
          // permission will be asked to send the notification.
          Notification.requestPermission(permission => {
            if (permission === 'granted') {
              makeNotification(data);
            }
          });
        }
      }
    });
  }

  notificationWindowCheck() {
    // This function makes sure notifications are only shown once if
    // Lily is open in multiple windows/tabs.
    const timestamp = localStorage.getItem('timestamp') || false;

    let dateNow = new Date();

    if (!timestamp || timestamp < dateNow.getTime() - 4000) {
      // The window sending the notifications will write a timestamp to localstorage
      // every second. When a notification is received and the timestamp is
      // older than 2 seconds, another window will take over.
      localStorage.setItem('timestamp', dateNow.getTime());

      this.sendNotification = true;

      setInterval(() => {
        dateNow = new Date();
        localStorage.setItem('timestamp', dateNow.getTime());
      }, 1000);
    }
  }
}

export default new Notifications();
