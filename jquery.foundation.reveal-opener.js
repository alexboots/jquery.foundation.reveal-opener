/* Dependancies:  1) jQuery           
                  2) foundation-5 JS (specifically for the reveal)
                  3) cookies.js (only used / loaded in browsers lt-ie8)
                                                                                
      What is this file?! 

        This can be used by any new coupon website to make the users out click work!
        
        It will open a new tab with the coupon info code, and 
        the current window is forwarded to the merchant page.

        Click on a get code button here for an example:
        http://www.bestcouponsforyou.com/stores/1800flowers

      How to use this file!

       Each site has a main.js
       To add a modal to a click, in that file you must:
         
         1) set up a app_conf object with the CSS class's used on the site
         2) on document load, have any out link trigger 
            PHASES_APP.startClickAction( this, app_conf );

      Here is a screenshot of the code: 
       
       Example:

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
        class_outLink_modal:     '.modal-store-link', //is setting the href on a.modal-store-link
        class_couponTitle_modal: '.modal-title',
        class_couponDescription_modal:'.modal-description',
        class_CouponCode_modal:       '.coupon-code', //coupon code is set to this (can be input or 'a' or div or whatever)
        class_copyCodeBtnWrap_modal:     '.modal-copy-code-wrap' //it gets hidden if its activated, not coupon
      };

      And to launch the app: 
        $('.out').click(function () {
          PHASES_APP.startClickAction( this, app_conf );
        });
    */

;(function(window) {

  var PHASES_APP = PHASES_APP || {};

  window.PHASES_APP = {
    //store all coupon info in this
    //populated on click by getCouponInfo()
    
    localStorageName: "verytemporarilyStoredCouponInfo",

    startClickAction: function(clicked, app_conf ) {
      
      event.preventDefault();      

      this.onClickModule.getCouponInfo( clicked, app_conf ); // Grabs and saves all of the coupon info in Coupon: {}
      this.onClickModule.saveCouponInfo();                   // Saves couponId to localStorage or with a cookie
      this.onClickModule.clickAction();                      // Opens merchant in same page and opens modal in new tab

    },

    startModalAction: function() {      

      if( this.loadModalModule.checkForCouponInfo() === true ) {

        this.loadModalModule.placeMostCouponInfoOnModal(); // Place everything except for get code / activate
        this.loadModalModule.checkForCodeOrActivate();     // Setup the modal for an 'activate' type coupon or a coupon with a code 

        this.loadModalModule.openModal();                  // Opens the modal. 
        this.loadModalModule.deleteCouponInfo();           // Delete the localStorage coupon info

      }
    },

    startDebugAction: function() {
      

    },

      /* onClickModule {} contains everything used in startClickAction() */
      /*******************************************************************/

      onClickModule: {

        Coupon: {}, //this will store all the clicked coupon info
        Modal: {}, //this will store the classes needed to populate the modal

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

          this.Modal.modalId           = app_conf.id_modal;
          this.Modal.class_storeName   = app_conf.class_storeName;
          this.Modal.class_outLink     = app_conf.class_outLink;
          this.Modal.class_couponTitle       = app_conf.class_couponTitle_modal;
          this.Modal.class_couponDescription = app_conf.class_couponDescription_modal;
          this.Modal.class_couponCode        = app_conf.class_CouponCode_modal;
          this.Modal.class_copyCodeBtnWrap   = app_conf.class_copyCodeBtnWrap_modal;


        },

        /* saveCouponInfo()  ********************************
           Saves all of the clicked coupon info in localStorage so the modal can grab it
           The coupon info is stringified because localStorage can only store strings.*/

        saveCouponInfo: function() {
                                      //if localStorage is supported (ie8+)
          if(window.PHASES_APP.vendor.supports_html5_storage() ){
            
            var objectsToSave = {Coupon: this.Coupon, Modal: this.Modal},
                stringifiedInfoToSave = JSON.stringify( objectsToSave );
            
            localStorage.setItem( window.PHASES_APP.localStorageName, stringifiedInfoToSave);

          } else {
            
            //load in the cookies script so we can set a cookie
            $.getScript("vendor/js/cookies.js", function(){
              //cookie script laoded
              //set cookie here. 
            });
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


      /* loadModalModule {} contains everything used in startModalAction() */
      /*******************************************************************/
      loadModalModule: {

        infoForModal: null,

        /* checkForCouponInfo()
           This is triggered on document.load.
           Checks to see if a coupon as just clicked, and had its info stored.
           If nothing is stores nothing else in this module is triggered */

        checkForCouponInfo: function() {

          this.infoForModal = JSON.parse( localStorage.getItem( window.PHASES_APP.localStorageName ) );

          if(this.infoForModal !== null) { // if there is saved coupon info, set off the modal methods          
            return true;
          }

        },

        /* debugAppConf() 
           This is commented out in startModalAction() - but can be enabled to make sure everything is typed correctly in app_conf.
           It will let you know what classes are not on the page so you can easily fix them. */        

        placeMostCouponInfoOnModal: function() {

          $( this.infoForModal.Modal.modalId + " " + this.infoForModal.Modal.class_couponTitle ).text( this.infoForModal.Coupon.couponTitle );
          $( this.infoForModal.Modal.modalId + " " + this.infoForModal.Modal.class_couponCode ).text( this.infoForModal.Coupon.couponCode );
          $( this.infoForModal.Modal.modalId + " " + this.infoForModal.Modal.class_couponDescription ).text( this.infoForModal.Coupon.couponInfo );
          $( this.infoForModal.Modal.modalId + " " + this.infoForModal.Modal.class_copyCodeBtnWrap ).text( this.infoForModal.Coupon.couponTitle );
          $( this.infoForModal.Modal.modalId + " " + this.infoForModal.Modal.class_outLink ).text( this.infoForModal.Coupon.couponTitle );
        
        },
          
        /* codeOrActivate() **********************************************************
         * @Checks to see if this coupon has a code.
         * @It then sets up either the coupon or the 'Activated!' text on the modal. */

        checkForCodeOrActivate: function() {

          if( this.infoForModal.Coupon.couponCode.length !== 0 ) {
            
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
          if( !window.PHASES_APP.vendor.hasFlash ) {
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
        },

        openModal: function ( ) {

          $( this.infoForModal.Modal.modalId ).foundation('reveal', 'open');

        },

        deleteCouponInfo: function() {
          localStorage.removeItem( window.PHASES_APP.localStorageName );
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

  };//PHASES_APP

  window.PHASES_APP.startModalAction(); // Check for stored coupon info on every load
  $(document).foundation();             // Setup foundation
})(this);

/* add this debug code later 
  if ( $( this.infoForModal.Modal.class_couponTitle).length === 0  ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.couponTitle + afterClassMessage );             }
  if ( $( this.infoForModal.Coupon.class_couponCode ).length       ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_couponCode + afterClassMessage );        }
  if ( $( this.infoForModal.Coupon.class_couponDescription ).length) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_couponDescription + afterClassMessage ); }
  if ( $( this.infoForModal.Coupon.class_copyCodeBtnWrap ).length  ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_copyCodeBtnWrap + afterClassMessage );   }
  if ( $( this.infoForModal.Coupon.couponTitle ).length            ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_outLink + afterClassMessage );           }
*/
