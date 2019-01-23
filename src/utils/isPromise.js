const string = '[object Promise]';

export default function(p = {}) {
  return p.toString && string === p.toString();
}
