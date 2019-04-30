import React from 'react';

import Deck from './Deck';
import Player from './Player';

const DEFAULT_NUMBER_OF_PLAYERS = 2;

function defaultState() {
  return {
    deck: new Deck(),     // WARNING: Deck.deal() mutates itself.
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
    let has21 = false;
    Object.values(state.players).forEach(hand => {
      if (Deck.valueOfHand(hand) === 21) {
        has21 = true;
      }
    });
    return {
      hasWinner: has21
    };
  }

  render() {

    // Create an array of <Player /> elements from the entries in this.state.players
    const players = Object.keys(this.state.players).map(id => {
      const theirHand = this.state.players[id];
      const score = Deck.valueOfHand(theirHand);

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
          ...this.state.players,
          [id]: [...this.state.players[id], this.state.deck.deal()]
        }              
      });
    }
  }

  // Tried calling this in a loop, but the this.setState calls were
  // stepping on each other's toes.
  _addPlayer = (howMany=1) => {
    console.log('adding player');
    let newPlayers = {};

    // For however many players we're adding,
    // generate an id and a new hand of 2 cards.
    for (let i=0; i<howMany; i++) {
      console.log('adding player');
      const playerId = 'id_' + (new Date()).getTime();
      const newHand = [
        this.state.deck.deal(),
        this.state.deck.deal()
      ];
      newPlayers[playerId] =  newHand;
    }

    // Set the new state
    this.setState({
      players: {
        ...this.state.players,  // everything that was already in this.state.players
        ...newPlayers           // everything in our newPlayers object.
      }              
    });
  }

  _resetGame = () => {
    this.setState(defaultState(), () => {
      this._addPlayer(DEFAULT_NUMBER_OF_PLAYERS);
    });
  }
}

export default App;
