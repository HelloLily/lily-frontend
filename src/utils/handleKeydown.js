import { ENTER_KEY } from 'lib/constants';

export default function handleKeydown(event, handleSubmit) {
  if (event.target.type !== 'textarea') {
    event.preventDefault();
  }

  if (event.metaKey && event.keyCode === ENTER_KEY) {
    handleSubmit(event);
  }
}
