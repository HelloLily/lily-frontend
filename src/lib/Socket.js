import ReconnectingWebSocket from 'reconnecting-websocket';

class Socket {
  constructor() {
    const wsEnabled =
      'WebSocket' in window && 'Notification' in window && Notification.permission !== 'denied';

    this.wsEnabled = wsEnabled;
    this.listeners = {};
    this.ws = null;

    if (wsEnabled) {
      const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const socketBase = process.env.SOCKET_BASE;

      this.ws = new ReconnectingWebSocket(`${wsScheme}://${socketBase}/`);
      // Dispatch open and close events so these can be bound to.
      this.ws.onopen = () => this.dispatch('open');
      this.ws.onclose = () => this.dispatch('close');
      this.ws.onmessage = message => {
        const data = JSON.parse(message.data);

        if ('error' in data && data.error === 'unauthenticated') {
          window.location.reload();
        }

        if ('event' in data) {
          this.dispatch(data.event, data.data);
        }
      };
    }
  }

  // Allow functions to bind to specific WebSocket events.
  bind(type, callback) {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(callback);
  }

  unbind(type, callback) {
    const index = this.listeners[type].indexOf(callback);
    if (index > -1) {
      this.listeners[type].splice(index, 1);
    }
  }

  close(reason = '') {
    if (this.wsEnabled) this.ws.close(1000, reason);
  }

  dispatch(type, data = null) {
    // Dispatches the event and its data to all functions bound to the event.
    if (!(type in this.listeners)) return;

    this.listeners[type].forEach(callback => {
      callback(data);
    });
  }
}

export default new Socket();
