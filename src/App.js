import React from 'react';
import './App.css';

import Deck from './Deck';
import Player from './Player';

class App extends React.Component {
  constructor(props) {
    super(props);
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
    this.state = {
      deck: new Deck(),
      players: {},
      hasWinner: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    // see if there's a winner
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

    const players = Object.keys(this.state.players).map(id => {
      const theirHand = this.state.players[id];
      return <Player hand={theirHand} id={id} handleHit={this._hitMe} score={Deck.valueOfHand(theirHand)} />;
    })

    return (
      <div className="App">
        {
          this.state.hasWinner ? <h1>WINNING HAND!</h1> : <button onClick={this._addPlayer}>add player</button>
        }
        
        {players}
      </div>
    );
  }

  _findPlayerHand = (id) => {
    return this.state.players[id];
  }

  _hitMe = (id) => {
    console.log(id);
    console.log(this._findPlayerHand(id));
    this.setState({
      players: {
        ...this.state.players,
        [id]: [...this._findPlayerHand(id), this.state.deck.deal()]
      }              
    })
  }

  _addPlayer = () => {
    const playerId = 'id_' + (new Date()).getTime();
    const newHand = [
      this.state.deck.deal(),
      this.state.deck.deal()
    ]
    this.setState({
      players: {
        ...this.state.players,
        [playerId]: newHand
      }              
    })
  }
}

export default App;
