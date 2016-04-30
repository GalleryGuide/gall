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
      $(context).find('.menu__link').on('focus', function () {
        $(this).closest('.menu-item--expanded').addClass('has-focus');
      }).on('blur', function () {
        $(this).closest('.menu-item--expanded').removeClass('has-focus');
      });
    }
  }

})(jQuery, Drupal);