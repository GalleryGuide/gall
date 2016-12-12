(function ($, Drupal) {
  /**
   * Set up hover classes on tiles.
   */
  Drupal.behaviors.gallTiles = {
    attach: function (context, settings) {
      var $tiles = $(context).find('.tiles-view-tile');
      // TODO: when hovering, take focus style off others?
      $tiles.on('hover', function() {
        
      });
    }
  };

  /**
   * Make menu work nicely on keyboard.
   */
  Drupal.behaviors.gallMenu = {
    attach: function (context, settings) {

      // See https://snippets.webaware.com.au/snippets/make-css-drop-down-menus-work-on-touch-devices/
      
      // see whether device supports touch events (a bit simplistic, but...)
      var hasTouch = ("ontouchstart" in window);
      var iOS5 = /iPad|iPod|iPhone/.test(navigator.platform) && "matchMedia" in window;

      // hook touch events for drop-down menus
      // NB: if has touch events, then has standards event handling too
      // but we don't want to run this code on iOS5+
      if (hasTouch && document.querySelectorAll && !iOS5) {
        var i, len, element,
          dropdowns = document.querySelectorAll("#block-primarylinks .menu-item--expanded > a");

        function menuTouch(event) {
          // toggle flag for preventing click for this link
          var i, len, noclick = !(this.dataNoclick);

          // reset flag on all links
          for (i = 0, len = dropdowns.length; i < len; ++i) {
            dropdowns[i].dataNoclick = false;
          }

          // set new flag value and focus on dropdown menu
          this.dataNoclick = noclick;
          this.focus();
        }

        function menuClick(event) {
          // if click isn't wanted, prevent it
          if (this.dataNoclick) {
            event.preventDefault();
          }
        }

        for (i = 0, len = dropdowns.length; i < len; ++i) {
          element = dropdowns[i];
          element.dataNoclick = false;
          element.addEventListener("touchstart", menuTouch, false);
          element.addEventListener("click", menuClick, false);
        }
      }

      // Set up keyboard menu.
      $(context).find('.menu__link').on('focus', function () {
        $(this).closest('.menu-item--expanded').addClass('has-focus');
      }).on('blur', function () {
        $(this).closest('.menu-item--expanded').removeClass('has-focus');
      });
    }
  }

})(jQuery, Drupal);