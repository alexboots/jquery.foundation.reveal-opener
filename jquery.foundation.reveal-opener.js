var PHASES_APP = PHASES_APP || {};

PHASES_APP = {
  //store all coupon info in this
  //populated on click by getCouponInfo()
  Coupon: {},

  //sets everything off. 
  outLinkClicked: function( clicked, app_conf ) {
    event.preventDefault();
      
    //pass the clicked and the app_conf 
    this.getCouponInfo( clicked, app_conf );
    this.codeOrActivate

    
    // console.log( this.codeOrActivate() );
    // console.log( this.Coupon.outLink );
  },

  //populate Coupon object with all coupon infoinfo
  getCouponInfo: function( clicked, app_conf ) {
    this.Coupon.couponId    = $( clicked ).attr('href').match(/\d+$/)[0].trim();
    
    //a coupons ID is placed on the wrapper for every coupons
    //eg: <div class="coupon-wrap 34240"> //the coupon </div>
    class_couponId = '.' + this.Coupon.couponId;

    console.log(class_couponId + " " + app_conf.class_couponTitle);

    this.Coupon.app         =    app_conf.app_name;
    this.Coupon.couponTitle = $( class_couponId + " " + app_conf.class_couponTitle ).text().trim();
    this.Coupon.couponCode  = $( class_couponId + " " + app_conf.class_couponCode  ).text().trim();
    this.Coupon.couponInfo  = $( class_couponId + " " + app_conf.class_couponInfo ).text().trim();
    this.Coupon.storeName   = $( class_couponId + " " + app_conf.class_storeName ).text().trim();
    //this.Coupon.outLink     = $( class_couponId + " " + clicked ).attr('href').trim();
    

    console.log( "app: " + this.Coupon.app );
    console.log( "title: " + this.Coupon.couponTitle);
    console.log( "coupon code: " + this.Coupon.couponCode );
    console.log( "coupon info: " + this.Coupon.couponInfo );
    console.log( "store name: " + this.Coupon.storeName );
    console.log( "out link: " + this.Coupon.outLink  );
    console.log( "couponId: " + this.Coupon.couponId);

    console.log("***************************************************");
    console.log("***************************************************");
    console.log("***************************************************");

  },

  codeOrActivate: function() {
    if( this.Coupon.couponCode.length === 0 ) {      
      return false; //no coupon code
    } else { 
      return true; //coupon code 
    }
  },

  //storage module
  storage : {
    //check for html5 support
    supports_html5_storage : function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    },
    //set a cookie - this is only used if html5 support is not available 
    set_cookie : function () {
      //set cookie if no html5
    }
  }//storage module
}; //PHASES_APP

