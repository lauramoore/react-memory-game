var AppDispatcher = require('../dispatcher/AppDispatcher');
var TileConstants = require('../constants/TileConstants');
var Leap = require('leapjs');

var controller = new Leap.Controller({frameEventName: 'animationFrame'});
controller.connect();

controller.on('frame', function(_frame){
    console.log(_frame);
});

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
