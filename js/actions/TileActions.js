var AppDispatcher = require('../dispatcher/AppDispatcher');
var TileConstants = require('../constants/TileConstants');
var Leap = require('leapjs');

var controller = new Leap.Controller({frameEventName: 'animationFrame'});
controller.connect();

controller.on('frame', function(_frame){
     if (_frame && _frame.valid) {
        if (_frame.hands && _frame.hands.length > 0) {
            fireHandEvent(_frame.hands[0])
        }
     }
});

function fireHandEvent(hand) {
    if (! hand || ! hand.valid) return;
    console.log(hand);
}

var TileActions = {

    /**
     * @param  {string} text
     */
    clickTile: function(id) {
        AppDispatcher.dispatch({
            actionType: TileConstants.TILE_CLICK,
            id: id
        });
    },

    matchCheck: function() {
        AppDispatcher.dispatch({
            actionType: TileConstants.MATCH_CHECK
        });
    }

};

module.exports = TileActions;
