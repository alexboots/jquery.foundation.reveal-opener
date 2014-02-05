/* Dependancies:  1) jQuery           
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
         3) pass the app_conf to the modal loader 
            PHASES_APP.startModalAction( app_conf_58P );

      Download an example/skeleton version of this at:
       http://58phases.com/snippets

       Example:

        var app_conf_58P = {
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
  

  //has to be attatched to window so app_conf can trigger things
  window.PHASES_APP = {

    startClickAction: function( clicked ) {

      var couponId = Modules.onClickModule.getCouponId( clicked ); // Grabs and saves all of the coupon info in Coupon: {}
      Modules.onClickModule.saveCouponId( couponId, Modules.info.supports_html5_storage, Modules.info.storageKey );         // Saves couponId to localStorage or with a cookie (just using app_name as key)
      Modules.onClickModule.clickAction();          // Opens merchant in same page and opens modal in new tab
    },

    //this.startClickAction.getAppName() + "tempCouponInfo",
    startModalAction: function( app_conf ) {
      
      if( Modules.loadModalModule.checkForCouponId(Modules.info.storageKey) === true ) {
        
        Modules.loadModalModule.placeMostCouponInfoOnModal( app_conf ); // Place everything except for get code / activate        
        Modules.loadModalModule.setupForCodeOrActivate(Modules.info.hasFlash);     // check to see if it has a code or if its an 'actiavted' coupon
        Modules.loadModalModule.setModalOutLinks();
        Modules.loadModalModule.openModal();                  // Opens the modal. 
        Modules.loadModalModule.openModal();
        Modules.loadModalModule.deleteCouponInfo(Modules.info.storageKey);           // Delete the localStorage coupon info
      }
    }
  };

  Modules = {
    // /* onClickModule {} contains everything used in startClickAction() */
    // /*******************************************************************/
    // siteSpecificModule: (function(){ //not sure how to get this working yet 
    //   /* eg: if( app_config.app_name === wac_app )  { wac_app.someFunc() }; */
    // }),

    /**** END trigger  functions ****/


    /*** START Modules ***/
    /*********************/

      /* Info : info for functions module - gets info on page load thats needed to trigger everything! */
      /*************************************************************************************************/
      info: {
        //check for html5 support
        supports_html5_storage: (function() {
          
          try {
            return 'localStorage' in window && window['localStorage'] !== null;
          } catch (e) {
            
            return false;
          }
        })(),

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
        })(),

        /* (storageKey)() 

          This is the localStorage key, used to save and get the couponId.
          Grabs the domain name and makes it a string.      
          Seemed like a good way to get a unique key - could do it some other way. */

        storageKey: (function() {
          var hostArray = window.location.hostname.split('.'),
              hostString = hostArray.join('');

          return hostString;
        })(),
      },
      /*** end infoForFunctions module ***/

      /* onClickModule {} contains everything used in startClickAction() */
      /*******************************************************************/

      onClickModule: {

        Coupon: {}, //this will store all the clicked coupon info
        Modal: {}, //this will store the classes needed to populate the modal

        //populate Coupon object with all coupon info
        getCouponId: function( clicked ) {

          // Grabs the coupon Id
          return $( clicked ).attr('href').match(/\d+$/)[0].trim();
        },

        /* saveCouponId()  ********************************
           Saved the coupon Id so the modal can use it to load all the coupon info.
           Uses the sites URL as the key to store and grab the coupon. */

        saveCouponId: function( couponId, supports_html5_storage, storageKey ) {
          //if localStorage is supported (ie8+)
          if(supports_html5_storage){

            localStorage.setItem( storageKey, couponId);

          } else {
            //$ get cookie script            
            alert('f');
            $.getScript("/vendor/js/cookies.js");

            docCookies.setItem( storageKey, coupon_id );

          }
        },

        /* clickAction() *************************************
           Forward current window to merchant and     
           Open current window in new tab (modal will load) */

        clickAction: function() {
          window.location = this.Coupon.outLink; // This shouldn't be needed but including it. Can't hurt.
          window.open(document.location.href);
        },
      }, //end onClickModule module


      /* loadModalModule {} contains everything used in startModalAction() */
      /*******************************************************************/
      loadModalModule: {

        couponId: null,
        coupon: {},
        modal:  {},
        hasCode: false, // used to add zClip if needed
        //set storageKey via this.storageKey here so it doest have to run for check and for delete

        /* checkForCouponId()
           This is triggered on document.load
           Checks to see if a coupon was just clicked, and had its info stored.
           If nothing is stored nothing else in this module is triggered */

        checkForCouponId: function(storageKey) {

          var getCouponId =  localStorage.getItem(storageKey);
          this.couponId = getCouponId;

          if(this.couponId !== null) { // if there is saved coupon info, set off the modal methods          

            return true;
          }
        },

        placeMostCouponInfoOnModal: function( app_conf ) {
          
          var class_couponId = "." + this.couponId;

          this.coupon.title     = $( class_couponId + " " + app_conf.class_couponTitle ).text().trim();
          this.coupon.code      = $( class_couponId + " " + app_conf.class_couponCode  ).text().trim();
          this.coupon.fullInfo  = $( class_couponId + " " + app_conf.class_fullCouponInfo ).text().trim();
          this.coupon.storeName = $( class_couponId + " " + app_conf.class_storeName ).text().trim();
          this.coupon.outLink   = $( class_couponId + " " + app_conf.class_outLink ).attr('href').trim();

          this.modal.id       = app_conf.id_modal;
          this.modal.class_title    = app_conf.class_couponTitle_modal;
          this.modal.class_code     = app_conf.class_CouponCode_modal;
          this.modal.class_fullInfo = app_conf.class_fullCouponInfo_modal;
          this.modal.class_checkoutInstructions = app_conf.class_modalCheckoutInstructions;

          this.modal.class_outLink = app_conf.class_outLink_modal;
          this.modal.class_copyCodeBtn   = app_conf.class_copyCodeBtn_modal;
        },

        // Anything with a class_outLink_modal is going to given an out url 
        setModalOutLinks: function() {
              
              // Grab all out links on modal
          var $allOutLinks = $( this.modal.class_outLink ),
              i = 0;

          // Set all out links on modal
          for(; i < $allOutLinks.length; i++){
            $allOutLinks[i].href = this.coupon.outLink;
          }
        },
          
        /* codeOrActivate() **********************************************************
         * @Checks to see if this coupon has a code.
         * @It then sets up either the coupon or the 'Activated!' text on the modal. */

        setupForCodeOrActivate: function(hasFlash) {

          if( this.coupon.code.length !== 0 ) {
            
            this.setupCode(hasFlash);
          } else {
            
            this.setupActivate();
          }
        },

        /* setupCode() **********************************************************
         * @Sets up the code on the modal. 
         * @Checks for html5 storage, and falls back to cookie for old browsers.
         * @Checks for flash and hides copy button / changes from input to div (makes it selectable on mobile) if flash is not available. */

        setupCode: function(hasFlash) {
          this.hasCode = true;
          $( this.modal.class_checkoutInstructions ).text(" and paste your code at checkout.");
          
          //Setup for flash (using input and copy btn)
          if( hasFlash ) {
            this.setupModalWithCode();
          }
          //or not flash (with div containing code - so its copyable on mobile)
          else {
            this.setupModalWithCode_mobile();
          }
        },

        /* setupActivate() *****************************************************
         * Hide all code-related stuff and setup for activate                  */

        setupActivate: function () {

          $( this.modal.class_copyCodeBtn ).hide();
          $( this.modal.id + " form" ).hide();
          $( this.modal.class_code).hide(); // Incase its not a form in markup
          $( this.modal.class_checkoutInstructions ).text( " and deal will automatically be applied at checkout.");
        },
        
        /* setupModalWithCode() *****************************************************
         * This first checks to see if the code is being dispalyed in a div or a form with input field. 
         * It sets the val to the code if its a input, and sets the text of the element if its not */

        setupModalWithCode: function () {
          
          if( $(this.modal.class_code).is('input') ) {
            
            $( this.modal.class_code ).val( this.coupon.code );
          } else {
            
            $( this.modal.class_code ).text( this.coupon.code );
          }

        },

        setupModalWithCode_mobile: function () {
                    
          if( $(this.modal.class_code).is('input') ) {

            // Strip the dot off the couponClass so we can use it to add a div to display code on mobile
            var couponClass_stripOffDot = this.modal.class_code.substring(1, this.modal.class_code.length);

            // Change the form to a div and add the code to that since readonly input is not highlightable on some mobile deviced. 
            $( this.modal.id + " form" ).after("<div class='" + couponClass_stripOffDot + "'></div>");
            $( this.modal.id + " form" ).hide();

            // Add coupon to div
            $( this.modal.class_code ).text( this.coupon.code );

          } else {
            // Else just add it normally if its already a div or a span or something
            $( this.modal.class_code ).text( this.coupon.code );
          }

        },

        openModal: function() {
          $('.modal-bg').css('display', 'block');

          this.setCloseButtons();
          
          if(this.hasCode) {
            this.addZclip();
          }
        },

        setCloseButtons: function() {

          $('.modal-bg, .close-modal').click(function(e) {
            if((e.target != this) && (e.target != $('.close-modal'))) {
            // Do nothing if its a child element being clicked and not the bg 
               return true;
            } else {
             $('.modal-bg').fadeOut('fast');
            }
          });
        },


        addZclip: function() {
          var zclipUrl = "",
              pathArray = window.location.pathname.split('/'),
              isInput = $(this.modal.class_code).is('input');

          // zClips SWF has to be set in relation to the root url, not the page
          // NEED TO TEST THIS - should work on everything though
          for( i = 0; i < pathArray.length - 1 ; i++ ) {
            if( pathArray[i].length !== 0 ) {
              zclipUrl += "/" + pathArray[i];
            }
          }

          $( this.modal.class_copyCodeBtn ).zclip({
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


        deleteCouponInfo: function(storageKey) {
          localStorage.removeItem(storageKey);
        }

      } //end loadModalModule

  };//PHASES_MODULES
})(this);

/* add this debug code later 
  if ( $( this.infoForModal.Modal.class_couponTitle).length === 0  ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.couponTitle + afterClassMessage );             }
  if ( $( this.infoForModal.Coupon.class_couponCode ).length       ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_couponCode + afterClassMessage );        }
  if ( $( this.infoForModal.Coupon.class_fullCouponInfo_modal ).length) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_fullCouponInfo_modal + afterClassMessage ); }
  if ( $( this.infoForModal.Coupon.class_copyCodeBtn_modal ).length  ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_copyCodeBtn_modal + afterClassMessage );   }
  if ( $( this.infoForModal.Coupon.couponTitle ).length            ) { console.log ( beforeClassMessage + this.infoForModal.Coupon.class_outLink + afterClassMessage );           }
*/
