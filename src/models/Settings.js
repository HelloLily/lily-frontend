import { get, patch } from 'src/lib/api';

class Settings {
  constructor(component) {
    this.component = component;
  }

  get() {
    return get(`/users/me/browser_settings/?component=${this.component}`);
  }

  store(data) {
    data.component = this.component;

    return patch('/users/me/browser_settings/', data);
  }
}

export default Settings;
