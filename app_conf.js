$(document).ready(function(){
  
  //Check out vendor/jquery.modal-opener.js for info on this. 
  var app_conf = {
    app_name: "BestCodesForYou",
    class_couponTitle:       ".coupon-title",
    class_couponCode: ".hidden-coupon-code",
    class_couponInfo: ".coupon-description",
    class_storeName:  ".hidden-store-name",
    class_outLink: ".out",
    class_copyCodeBtn: ".btn-copy-code",

    id_modal:                '#modal_show_coupon',
    class_storeName_modal:   '.modal-store-name',
    class_outLink_modal:     '.modal-out-link', //is setting the href on a.modal-out-link
    class_couponTitle_modal: '.modal-coupon-title',
    class_couponDescription_modal:'.modal-coupon-description',
    class_CouponCode_modal:       '.modal-coupon-code',      //coupon code is set to this (can be input or 'a' or div or whatever)
    class_copyCodeBtnWrap_modal:     '.modal-copy-code-wrap' //it gets hidden if its 1) activated, not a coupon code or 2) if its a mobile or non-flash device 
  };
  
  $('.out').click(function () {
    
    PHASES_APP.startClickAction( this, app_conf );

  });


  // //add functionality on out link click 
  // app_modal.outLinkClicked('a.coupon-title');
  // app_modal.outLinkClicked('.coupon-btn-wrap > a');
  // app_modal.outLinkClicked('.store-square-logo.out');
  // app_modal.outLinkClicked('.store-square-logo'); 

  // //add copy swf to copy code button
  // app_modal.addCopyCodeTo(".btn-copy-code");
  
  // //make the 'get code' button slide out on hover
  // bcfy_app.set_get_code_hover_animation();

});//ready 

$(document).foundation();
