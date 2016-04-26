(function ($, Drupal) {
  /**
   * Initialise the tabs JS.
   */
  Drupal.behaviors.gallTiles = {
    attach: function (context, settings) {
      var $tiles = $(context).find('.view-galleries-a-z .views-row a');
      if ($tiles.length) {
        $tiles.on('focus blur', function() {
          $(this).closest('.views-row').toggleClass('has-focus');
        });
      }
    }
  };

})(jQuery, Drupal);