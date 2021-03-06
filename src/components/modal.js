export const Modal = (function () {
  const modalLoader = document.getElementById('modal');
  const level = document.getElementById('level');
  const stats = document.getElementById('stats');

  function hideLevel () {
    level.classList.add('hidden');
    stats.classList.add('hidden');
  }

  return {
    cancel: function () {
      modalLoader.innerHTML = '';
      level.classList.remove('hidden');
      stats.classList.remove('hidden');
    },

    open: function (name, callbacks) {
      const modal = document.getElementById('modal_' + name);
      modalLoader.innerHTML = modal.innerHTML;
      hideLevel();

      for (const callback in callbacks) {
        const inter = modalLoader.querySelector('#interactive_' + callback);

        inter.classList.add('click');
        inter.addEventListener('click', callbacks[callback].bind(modalLoader));
      }
    }
  };
})();
