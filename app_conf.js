$(document).ready(function(){
  
  //Check out vendor/jquery.modal-opener.js for info on this. 
  var app_conf = {
    app_name:             "BestCodesForYou",
    class_couponTitle:    ".coupon-title",
    class_couponCode:     ".hidden-coupon-code",
    class_fullCouponInfo: ".coupon-description",
    class_storeName:      ".hidden-store-name",
    class_outLink:        ".out",

    id_modal:                     '#modal-show-coupon',
    class_couponTitle_modal:      '.modal-coupon-title',
    class_CouponCode_modal:       '.modal-coupon-code',      // Coupon code is set to this element using text()
    class_fullCouponInfo_modal:   '.modal-coupon-description',
    class_storeName_modal:        '.modal-store-name',
    class_outLink_modal:          '.modal-out-link',         // Is setting the href on a.modal-out-link
    class_copyCodeBtn_modal:      '.modal-btn-copy',    // It gets hidden if its 1) activated, not a coupon code or 2) if its a mobile or non-flash device 
    class_modalCheckoutInstructions: '.modal-checkout-instructions'
  };
  
  $('.out').click(function () {    
    PHASES_APP.startClickAction( this, app_conf );
  });
});//ready 

$(document).foundation();
