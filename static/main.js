import AssignArrangers from './components/vue/assign-arrangers.js';

const MODAL_TMPL = Handlebars.templates['partials/common/components/user-picker']; 

const MODAL_OPTIONS = {
  modalId: 'user-picker',
  title: 'Title',
  panel: true,
  confirm: true,
  panelSize: 'small',
  confirmText: 'save',
  content: MODAL_TMPL()
};

$('#assign-approvers').on('click', assignApprovers);
$('#assign-arrangers').on('click', assignApprovers);


uitk.subscribe('modal.appended', onModalOpen);

// assignApprovers();

function assignApprovers () {
  let modal;

  modal = uitk.modal.create(MODAL_OPTIONS);

  modal.open();
}

function onModalOpen () {
  console.log('modal: open');
  
  new Vue({
    el: '#user-picker-content',
    components: {AssignArrangers}
  });
  
}

// new Vue({
//   el: '#app',
//   components: {AssignArrangers}
// });
