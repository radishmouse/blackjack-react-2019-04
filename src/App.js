import React from 'react';

import Deck from './Deck';
import Player from './Player';

const DEFAULT_NUMBER_OF_PLAYERS = 2;

function defaultState() {
  return {
    deck: new Deck(),     // WARNING: this.state.deck.deal() causes the deck to mutate itself.
                          // This is fine, as changing the contents of the deck does not cause a re-render.
    players: {
      // Each entry in the players object is an id and an array of Card instances.
      // id_1556645908371: [ Card, Card, Card ]
    },          
    hasWinner: false
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState();

    // this.deck = new Deck();
    // let hand = [this.deck.deal(), this.deck.deal()];
    // let hand2 = [this.deck.deal(), this.deck.deal()];
    // // console.log(this.deck.cards.length);
    // console.log(Deck.valueOfHand(hand));
    // console.log(Deck.valueOfHand(hand2));
    // console.log('====== winner =====');
    // const winnerStatus = Deck.doesBeat(hand, hand2);
    // if (winnerStatus === 1) {
    //   console.log('hand1 wins');
    // } else if (winnerStatus === -1) {
    //   console.log('hand2 wins');
    // } else {
    //   console.log('tie');
    // }

  }

  componentDidMount() {    
    this._addPlayer(DEFAULT_NUMBER_OF_PLAYERS);
  }

  // Each time we're about to render, see if there's a player with a winning hand.
  static getDerivedStateFromProps(props, state) {    

    // Return the new key/value pairs in state.
    return {
      hasWinner: App._doesWinnerExist(state)    // Calls static method because getDerivedStateFromProps is static,
                                                // so I can't do this._doesWinnerExist.
                                                // (getDerivedStateFromProps belongs to the class, not to an instance.)
    };
  }

  render() {

    // Create an array of <Player /> elements from the entries in this.state.players
    const players = Object.keys(this.state.players).map(id => {
      const theirHand = this.state.players[id];
      const score = Deck.valueOfHand(theirHand);

      // This return goes with the .map, not with the .render()
      return (
        <Player 
          key={id} 
          id={id} 
          hand={theirHand} 
          handleHit={score <= 21 ? this._hitMe : null} 
          score={score} 
        />
      );
    })

    // Render a button to add more players and our array of <Player /> elements
    return (
      <div className="App">
        {
          this.state.hasWinner ? <h1>WINNING HAND!</h1> : <button onClick={() => this._addPlayer() }>add player</button>
        }        
        <button onClick={this._resetGame}>new game</button>
        {players}
      </div>
    );
  }

  _hitMe = (id) => {
    // Only give players more cards if there isn't a winner.
    if (!this.state.hasWinner) {
      this.setState({
        players: {

          ...this.state.players, // Copy all the existing players into the new version of state.

          [id]: [...this.state.players[id], this.state.deck.deal()]  // Overwrite the one based on id,
                                                                     // copying their existing cards, and 
                                                                     // drawing a new card.


        // ^^ Note that we can use a "dynamic key"
        }              
      });
    }
  }

  // Tried calling this in a loop, but the this.setState calls were
  // stepping on each other's toes.
  _addPlayer = (howMany=1) => {
    let newPlayers = {};

    // For however many players we're adding,
    // generate an id and a new hand of 2 cards.
    for (let i=0; i<howMany; i++) {
      // console.log('adding player');
      // const playerId = 'id_' + (new Date()).getTime();   // Every now and then, results in two players with same id.
                                                            // Since we're putting in an object, one player overwrites the other.

      const playerId = `id_${i}_${(new Date()).getTime()}`; // This guarantees that the ids are different.
      const newHand = [
        this.state.deck.deal(),
        this.state.deck.deal()
      ];
      newPlayers[playerId] =  newHand;
    }
    console.log(newPlayers);

    // Set the new state
    this.setState({
      players: {
        ...this.state.players,  // everything that was already in this.state.players
        ...newPlayers           // everything in our newPlayers object.
      }              
    });
  }

  // Looks at each hand, compares its value to 21.
  // Returns true if *any* player has 21.
  // It's a static method, because we have to call it from getDerivedStateFromProps.
  static _doesWinnerExist(state) {
    let has21 = false;
    Object.values(state.players).forEach(hand => {
      if (Deck.valueOfHand(hand) === 21) {
        has21 = true;
      }
    });
    return has21;
  }

  _resetGame = () => {
    this.setState(defaultState(), () => {
      this._addPlayer(DEFAULT_NUMBER_OF_PLAYERS);
    });
  }
}

export default App;
