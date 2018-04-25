import { get, patch } from 'src/lib/api';

class Settings {
  constructor(component) {
    this.component = component;
  }

  get() {
    return get(`/users/me/settings/?component=${this.component}`);
  }

  store(data) {
    data.component = this.component;

    const response = patch('/users/me/settings/', data);

    return response;
  }
}

export default Settings;
