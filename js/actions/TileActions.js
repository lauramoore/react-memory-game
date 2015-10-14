var AppDispatcher = require('../dispatcher/AppDispatcher');
var TileConstants = require('../constants/TileConstants');
var Leap = require('leapjs');

var controller = new Leap.Controller(
                    {frameEventName: 'animationFrame',
                     enableGestures: true});
controller.connect();

controller.on('frame', function(_frame){
     if (_frame && _frame.valid) {
        var interactionBox = _frame.interactionBox;
        if (isHandGrabbing(_frame.hands)) {
            var hand = _frame.hands[0];
            var normalizedHand = interactionBox.normalizePoint(hand.stabilizedPalmPosition, true);
            TileActions.grabTile(normalizedHand);
        } else {
          if(_frame.gestures.length > 0) {
              _frame.gestures.forEach(function(gesture){
                 if(gesture.type === "screenTap") {
                    console.log(gesture);
                    var normalizedGesture = interactionBox.normalizePoint(gesture.position, true);
                    TileActions.grabTile(normalizedGesture);
                 }
              });
          }
       }
     }
});

function isHandGrabbing(handList) {
    if (!handList || handList.length === 0) return false;
    var hand = handList[0];
    if (! hand || ! hand.valid) return false;
    return hand.grabStrength > .75;
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
    },

    grabTile: function(normalizedPoint) {
        AppDispatcher.dispatch({
           actionType: TileConstants.TILE_GRAB,
           x: normalizedPoint[0],
           y: normalizedPoint[1]
        });
    }

};

module.exports = TileActions;
