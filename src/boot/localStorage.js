import { boot } from 'quasar/wrappers';

const localstorage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};

export default boot(({ app }) => {
  // Add localStorage to Vue prototype
  app.config.globalProperties.$localstorage = localstorage
});

export { localstorage }
