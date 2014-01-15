 

/* Dependancies:  1) jQuery           
                  2) foundation-5 JS (specifically for the reveal)
                  3) zClip   
                  4) cookies.js (only used / loaded in browsers lt-ie8)
                                                                                
      What is this file?! 

        This can be used by any new coupon website to make the users out click work!
        
        It will open a new tab with the coupon info, and 
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
      todo: PUT LINK TO SCREENSHOT HERE
       
       Example:

        var app_conf = {
          app_name:             "BestCodesForYou",
          class_couponTitle:    ".coupon-title",
          class_couponCode:     ".hidden-coupon-code",
          class_fullCouponInfo: ".coupon-description",
          class_storeName:      ".hidden-store-name",
          class_outLink:        ".out",

          id_modal:                     '#modal_show_coupon',
          class_couponTitle_modal:      '.modal-coupon-title',
          class_CouponCode_modal:       '.modal-coupon-code',      // Coupon code is set to this element using text()
          class_fullCouponInfo_modal:   '.modal-coupon-description',
          class_storeName_modal:        '.modal-store-name',   
          class_outLink_modal:          '.modal-out-link',         // Is setting the href on a.modal-out-link
          class_copyCodeBtn_modal:      '.modal-copy-code-wrap'    // It gets hidden if its 1) activated, not a coupon code or 2) if its a mobile or non-flash device 
        };

      And to launch the app: 
        $('.out').click(function () {
          PHASES_APP.startClickAction( this, app_conf );
        });

      Note:
        This is the recommended HTML for displaying the code on the modal/reveal:

          <form class="coupon-code-wrap">
            <input type="text" class="coupon-code" value="TH3C0D3" readonly="readonly" style="z-index: 9999;">
          </form>

        It will be changed to be a selectable div for mobile.

        Questions:
          What if the site doesnt have a storename on the modal, or doesnt have fullCouponInfo being display?
        Answer:
          Thats fine! Just leave them out! The app_conf Object does not need to have all of the above options included.
          These are the max-things might need, but leaving any of them out is totally fine. Nothing bad will happen! 

        If there are any more questions or concers hit me up at: alex@58phases.com :) 

    */

;(function(window) {

  var PHASES_APP = PHASES_APP || {};

  window.PHASES_APP = {
    
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
        this.loadModalModule.setupForCodeOrActivate();     // check to see if it has a code or if its an 'actiavted' coupon
        this.loadModalModule.openModal();                  // Opens the modal. 
        this.loadModalModule.deleteCouponInfo();           // Delete the localStorage coupon info
      }
    },

    /* onClickModule {} contains everything used in startClickAction() */
    /*******************************************************************/
    siteSpecificModule: (function(){
      
    }),

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
          this.Coupon.outLink     = $( class_couponId + " " + app_conf.class_outLink ).attr('href').trim();

          this.Modal.modalId                    = app_conf.id_modal;
          this.Modal.class_couponTitle          = app_conf.class_couponTitle_modal;
          this.Modal.class_couponCode           = app_conf.class_CouponCode_modal;
          this.Modal.class_outLink              = app_conf.class_outLink_modal;
          this.Modal.class_fullCouponInfo_modal = app_conf.class_fullCouponInfo_modal;
          this.Modal.class_storeName            = app_conf.class_storeName_modal;
          this.Modal.class_copyCodeBtn_modal    = app_conf.class_copyCodeBtn_modal;
          this.Modal.class_modalCheckoutInstructions  = app_conf.class_modalCheckoutInstructions;


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
          var getCouponInfo =  localStorage.getItem( window.PHASES_APP.localStorageName ) ,
              parseCouponInfo = JSON.parse( getCouponInfo );
              
          this.infoForModal = parseCouponInfo;

          if(this.infoForModal !== null) { // if there is saved coupon info, set off the modal methods          
            console.log( this.infoForModal );
            return true;
          }

        },

        placeMostCouponInfoOnModal: function() {

          $( this.infoForModal.Modal.modalId + " " +
             this.infoForModal.Modal.class_couponTitle          ).text( this.infoForModal.Coupon.couponTitle);

          $( this.infoForModal.Modal.modalId + " " +
             this.infoForModal.Modal.class_couponCode           ).text( this.infoForModal.Coupon.couponCode );

          $( this.infoForModal.Modal.modalId + " " +
             this.infoForModal.Modal.class_fullCouponInfo_modal ).text( this.infoForModal.Coupon.couponInfo );
          
          $( this.infoForModal.Modal.modalId + " " +
             this.infoForModal.Modal.class_storeName            ).text( this.infoForModal.Coupon.storeName  );

          this.setModalOutLinks();

        },

        // Anything with a class_outLink_modal is going to given an out url 
        setModalOutLinks: function() {
              
              // Grab all out links on modal
          var $allOutLinks = $( this.infoForModal.Modal.class_outLink ),
              i = 0;

          // Set all out links on modal
          for(; i < $allOutLinks.length; i++){
            $allOutLinks[i].href = this.infoForModal.Coupon.outLink;
          }
        },
          
        /* codeOrActivate() **********************************************************
         * @Checks to see if this coupon has a code.
         * @It then sets up either the coupon or the 'Activated!' text on the modal. */

        setupForCodeOrActivate: function() {

          if( this.infoForModal.Coupon.couponCode.length !== 0 ) {
            
            this.setupCode();
          } else {
            
            this.setupActivate();
          }
        },

        /* setupCode() **********************************************************
         * @Sets up the code on the modal. 
         * @Checks for html5 storage, and falls back to cookie for old browsers.
         * @Checks for flash and hides copy button / changes from input to div (makes it selectable on mobile) if flash is not available. */

        setupCode: function() {
          
          $( this.infoForModal.Modal.class_modalCheckoutInstructions ).text(" and paste your code at checkout.");
          
          //Setup for flash (using input and copy btn)
          if( window.PHASES_APP.vendor.hasFlash ) {
            
            this.setupModalWithCode();
            
               //add zClip's copy SWF on modal load
            $( this.infoForModal.Modal.modalId  ).bind('opened', function() {
              window.PHASES_APP.loadModalModule.addZclip();
            });
          }
          //or not flash (with div containing code - so its copyable on mobile)
          else {
            this.setupModalWithCode_mobile();
          }
        },

        addZclip: function() {
          var zclipUrl = "",
              pathArray = window.location.pathname.split('/'),
              isInput = $(this.infoForModal.Modal.class_couponCode).is('input');



          // zClips SWF has to be set in relation to the root url, not the page
          // NEED TO TEST THIS - should work on everything though
          for( i = 0; i < pathArray.length - 1 ; i++ ) {
            if( pathArray[i].length !== 0 ) {
              zclipUrl += "/" + pathArray[i];
            }
          }

          $( this.infoForModal.Modal.class_copyCodeBtn_modal ).zclip({
            path: zclipUrl + "/vendor/zclip/ZeroClipboard.swf",
            copy: function() {
              if(isInput === true) {
                return $(this).prev().find('input').val();
              } else {
                return $(this).prev().text();
              }
            },
            afterCopy: function() {

              $(this).css("background-color", "#80BE80");
              return $(this).text("Copied!");
            }
          });
        },

        /* setupActivate() *****************************************************
         * Hide all code-related stuff and setup for activate                  */

        setupActivate: function () {

          $( this.infoForModal.Modal.class_copyCodeBtn_modal ).hide();
          $( this.infoForModal.Modal.modalId + " form" ).hide();
          $( this.infoForModal.Modal.class_couponCode).hide(); // Incase its not a form in markup
          $( this.infoForModal.Modal.class_modalCheckoutInstructions ).text( " and deal will automatically be applied at checkout.");
        },
        
        /* setupModalWithCode() *****************************************************
         * This first checks to see if the code is being dispalyed in a div or a form with input field. 
         * It sets the val to the code if its a input, and sets the text of the element if its not */

        setupModalWithCode: function () {
          

          if( $(this.infoForModal.Modal.class_couponCode).is('input') ) {
            
            $( this.infoForModal.Modal.class_couponCode ).val( this.infoForModal.Coupon.couponCode );
          } else {
            
            $( this.infoForModal.Modal.class_couponCode ).text( this.infoForModal.Coupon.couponCode );
          }

        },

        setupModalWithCode_mobile: function () {
                    
          if( $(this.infoForModal.Modal.class_couponCode).is('input') ) {

            // Strip the dot off the couponClass so we can use it to add a div to display code on mobile
            var couponClass_stripOffDot = this.infoForModal.Modal.class_couponCode.substring(1, this.infoForModal.Modal.class_couponCode.length);

            // Change the form to a div and add the code to that since readonly input is not highlightable on some mobile deviced. 
            $( this.infoForModal.Modal.modalId + " form" ).after("<div class='" + couponClass_stripOffDot + "'></div>");
            $( this.infoForModal.Modal.modalId + " form" ).hide();

            // Add coupon to div
            $( this.infoForModal.Modal.class_couponCode ).text( this.infoForModal.Coupon.couponCode );

          } else {
            // Else just add it normally if its already a div or a span or something
            $( this.infoForModal.Modal.class_couponCode ).text( this.infoForModal.Coupon.couponCode );
          }

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
  if ( $( this.infoForModal.Coupon.class_fullCouponInfo_modal ).length) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_fullCouponInfo_modal + afterClassMessage ); }
  if ( $( this.infoForModal.Coupon.class_copyCodeBtn_modal ).length  ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_copyCodeBtn_modal + afterClassMessage );   }
  if ( $( this.infoForModal.Coupon.couponTitle ).length            ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_outLink + afterClassMessage );           }
*/
