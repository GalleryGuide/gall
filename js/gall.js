(function ($, Drupal) {
  /**
   * Set up hover classes on tiles.
   */
  Drupal.behaviors.gallTiles = {
    attach: function (context, settings) {
      var $tiles = $(context).find('.view-galleries-a-z .views-row a');
      if ($tiles.length) {
        $tiles.on('focus mouseenter', function() {
          $('.views-row.has-focus').removeClass('has-focus');
          $(this).closest('.views-row').addClass('has-focus');
        }).on('blur mouseleave', function() {
          $(this).closest('.views-row').removeClass('has-focus');
        });
      }
    }
  };

})(jQuery, Drupal);