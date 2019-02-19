import { get, patch } from 'src/lib/api';

class Settings {
  constructor(component) {
    this.component = component;
  }

  get() {
    const params = {};

    if (this.component) {
      params.component = this.component;
    }

    return get('/users/me/settings/', params);
  }

  store(data) {
    if (this.component) {
      data.component = this.component;
    }

    return patch('/users/me/settings/', data);
  }
}

export default Settings;
