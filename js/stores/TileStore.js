var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TileConstants = require('../constants/TileConstants');
var assign = require('object-assign');
var _ = require('lodash');
var TileActions = require('../actions/TileActions');

var CHANGE_EVENT = 'change';


var _tiles = [];
var _selectedTiles = [];


function generateTiles() {
    var images = [];
    for (var i = 1; i < 9; i++) {
        images.push("images/" + i + ".jpg");
    }
    images = _.shuffle(images);
    images = images.concat(images);
    for (var i = 0; i < images.length; i++) {
        _tiles.push({
            image: images[i],
            flipped: false,
            matched: false
        });
    }
}

function onSelectTile(index) {
        if (_selectedTiles.length > 2) return;

        _selectedTiles.push(index);
        var tile = _tiles[index];
        tile.flipped  = true;
        
       if (_selectedTiles.length == 2) {
           setTimeout(function () {
              TileActions.matchCheck();
           }, 2000);
        }
}

function resolveTile(x, y) {
    var columns;
    if (x < .25) { columns = [0,4,8,12]; }
    else if (x < .50) { columns = [1,5,9,13]; }
    else if (x < .75) { columns = [2,6,10,14]; }
    else { columns = [3,7,11,15]; }
    
    var tileIndex;
    if (y > .75 ) { tileIndex = columns[0]; }
    else if (y > .50 ) { tileIndex = columns[1]; }
    else if (y > .25 ) { tileIndex = columns[2]; }
    else { tileIndex = columns[3]; }

    console.log(_tiles[tileIndex]);

    onSelectTile(tileIndex);
}

function matchCheck() {
    _selectedTiles = [];
    var flipped = [];

    /**
     * Check if there is any matching tile
     */

    _tiles.map(function(tile, index){

        if (tile.flipped === true && tile.matched === false) {
            flipped.push(index);
        }

    });

    if (flipped.length < 2) return;

    if (_tiles[flipped[0]].image === _tiles[flipped[1]].image) {
        _tiles[flipped[0]].matched = true;

        _tiles[flipped[1]].matched = true;


    } else {
        _tiles[flipped[0]].flipped = false;

        _tiles[flipped[1]].flipped = false;

    }
}
var TileStore = assign({}, EventEmitter.prototype, {


    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    getAll: function () {
        return _tiles;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    isWaiting: function () {

       return _selectedTiles.length == 2;
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
TileStore.dispatchToken = AppDispatcher.register(function (action) {

    switch (action.actionType) {
        case TileConstants.TILE_CLICK:
            onSelectTile(action.id);
            TileStore.emitChange();
            break;

        case TileConstants.MATCH_CHECK:
            matchCheck();
            TileStore.emitChange();
            break;

        case TileConstants.TILE_GRAB:
            resolveTile(action.x, action.y);
            TileStore.emitChange();
            break;  
        default:
        // no op
    }
});

generateTiles();


/**
 * When a tile is clicked
 */

module.exports = TileStore;
