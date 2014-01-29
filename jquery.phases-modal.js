$(document).ready( function() {
  
  var phases_modal = {

    openModal: function() {
      $('.modal-bg').css('display', 'block');
    },

    closeModal: function() {

      $('.modal-bg').fadeOut('fast');
    }
  };

    //phases_modal.openModal();
    
  $('.close-modal').click(function() {
    phases_modal.closeModal();
  });
  $('.modal-bg').click(function(e) {
    
    if(e.target != this){ //make sure its the background and not a child 
       return true;
    } else {
     phases_modal.closeModal(this);
    }
    
  });

});