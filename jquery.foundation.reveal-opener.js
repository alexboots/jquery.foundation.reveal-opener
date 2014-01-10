/* Dependancies:  1) jQuery           
                  2) foundation-5 JS (specifically for the reveal)
                  3) cookies.js (only used / loaded in browsers lt-ie8)
                                                                                
                                               
/*
something like:
[ outLinkClicked() ]_______>[ getCouponInfo(clicked, app_conf) ]        
                   |                                                    
                   |_______>[ codeOrActivate() ]if______>[ setupCode() ]<______>[ vendor.supports_html5_storage() - sends true or false back to setupCode() ]  
                                               |                       |                    
                                               |                       |   |if____>[ storeCouponId() ]--------
                                               |                       |__>|                                  |-->[ populateModal(cookieOrLocal) ]
                                               |                           |else__>[ storeCouponCookie() ]----                                                

                                               |                                               
                                               |
                                               |else____>[ setupActivate() ]

*/
;(function(window) {

  var PHASES_APP = PHASES_APP || {};
  window.PHASES_APP = {
    //store all coupon info in this
    //populated on click by getCouponInfo()
    
    localStorageName: "verytemporarilyStoredCouponInfo",

    onClickModule: {

      Coupon: {}, //this will store all the clicked coupon info

      //sets everything off.
      outLinkClicked: function( clicked, app_conf ) {
          event.preventDefault();

          //this.getCouponId( clicked, app_conf );

          // Grab and store all of the coupon info in Coupon: {}
          this.getCouponInfo( clicked, app_conf );

          //saves couponId to localStorage or with a cookie
          this.saveCouponInfo();
          
          //opens merchant in same page and opens modal in new tab
          this.clickAction();
      },

      //populate Coupon object with all coupon info
      getCouponInfo: function( clicked, app_conf ) {

        // Grab coupon from the clicked link 
        this.Coupon.couponId = $( clicked ).attr('href').match(/\d+$/)[0].trim();
        
        //a coupons ID is placed on the wrapper for every coupons
        //eg: <div class="coupon-wrap 34240"> //the coupon </div>
        //So, we can grab the coupon info using the couponId class
        class_couponId = '.' + this.Coupon.couponId;

        this.Coupon.app         =    app_conf.app_name;
        this.Coupon.couponTitle = $( class_couponId + " " + app_conf.class_couponTitle ).text().trim();
        this.Coupon.couponCode  = $( class_couponId + " " + app_conf.class_couponCode  ).text().trim();
        this.Coupon.couponInfo  = $( class_couponId + " " + app_conf.class_couponInfo ).text().trim();
        this.Coupon.storeName   = $( class_couponId + " " + app_conf.class_storeName ).text().trim();
        this.Coupon.outLink     = $( class_couponId + " .out" ).attr('href').trim();

        //If its not working, check to make sure everything is coming through properly. 
        /*
        console.log( "app: " + this.Coupon.app );
        console.log( "title: " + this.Coupon.couponTitle);
        console.log( "coupon code: " + this.Coupon.couponCode );
        console.log( "coupon info: " + this.Coupon.couponInfo );
        console.log( "store name: " + this.Coupon.storeName );
        console.log( "out link: " + this.Coupon.outLink  );
        console.log( "couponId: " + this.Coupon.couponId);
        console.log("***************************************************");
        */
      },

      /* saveCouponInfo()  ********************************
         Saves all of the clicked coupon info in localStorage so the modal can grab it
         The coupon info is stringified because localStorage can only store strings.*/

      saveCouponInfo: function() {
        if(window.PHASES_APP.vendor.supports_html5_storage() ){
          var stringifiedCouponInfo = JSON.stringify( this.Coupon );
          
          localStorage.setItem( window.PHASES_APP.localStorageName, stringifiedCouponInfo);

        } else {

          console.log('Set Cookie');
        }
      },

      /* clickAction() *************************************
         Forward current window to merchant and     
         Open current window in new tab (modal will load) */

      clickAction: function() {
        //window.location = this.Coupon.outLink;
        window.open(document.location.href);
      },

    }, //end onClickModule module

    loadModalModule: {

      Coupon: null,

      /* checkForCouponInfo()
         This is triggered on document.load.
         Checks to see if a coupon as just clicked, and had its info stored.
         If nothing is stores nothing else in this module is triggered */

      checkForCouponInfo: function() {


        this.Coupon = JSON.parse( localStorage.getItem( window.PHASES_APP.localStorageName ) );
        
        if(this.Coupon !== null) {
          console.log(this.Coupon);

          localStorage.removeItem( window.PHASES_APP.localStorageName );
        } else {
          console.log(this.Coupon);
        }
      },

      /* codeOrActivate() **********************************************************
       * @Checks to see if this coupon has a code.
       * @It then sets up either the coupon or the 'Activated!' text on the modal. */

      codeOrActivate: function() {
        if( this.Coupon.couponCode.length === 0 ) {
          this.setupCode();
        } else {
          this.setupActivate();
        }
      },

      setupActivate: function () {
        
      },

      /* setupCode() **********************************************************
       * @Sets up the code on the modal. 
       * @Checks for html5 storage, and falls back to cookie for old browsers.
       * @Checks for flash and hides copy button / changes from input to div (makes it selectable on mobile) if flash is not available. */

      setupCode: function() {
        
        //Setup for flash (using input and copy btn)
        if( !this.vendor.hasFlash ) {
          this.setupModalWithCode_mobile();
        }
        //or not flash (with div containing code - so its copyable on mobile)
        else {
          this.setupModalWithCode();
        }
      },
      
      setupModalWithCode: function () {
        console.log('setup with code');
      },

      setupModalWithCode_mobile: function () {
        console.log('setup with code for mobile');
      }

    }, //end loadModalModule

    //Vendor module
    vendor: {
      //check for html5 support
      supports_html5_storage: function() {
        try {
          return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
          return false;
        }
      },
      //set a cookie - this is only used if html5 support is not available 
      set_cookie : function () {
      //set cookie if no html5

      },

      /***********************   hasFlash info   *************************
      * @Self executing function 
      * @Checks to see if the browsers has flash available. 
      ********************************************************************/
      hasFlash: (function() {
        var hasFlash = false;
        try {
          var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
          if(fo) hasFlash = true;
        }catch(e){
          if(navigator.mimeTypes ["application/x-shockwave-flash"] !== undefined) hasFlash = true;
        }
        return hasFlash;
      })()
    }//vendor module
  }; //PHASES_APP

  // Check to see if the page is being loaded from a user click, and load the modal if it is 

  window.PHASES_APP.loadModalModule.checkForCouponInfo();

})(this);
