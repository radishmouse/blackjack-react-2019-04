import React from 'react';
import axios from 'axios';
import {randInt} from './utils';

const styles = {
    bust: {
        color: 'red'
    },
    ok: {
        color: 'black'
    }
}

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }
    async componentDidMount() {
        const {data} = await axios.get('https://my-little-cors-proxy.herokuapp.com/http://names.drycodes.com/10?nameOptions=girl_names')
        console.log(data);
        this.setState({
            name: data[randInt(data.length)].replace('_', ' ')
        })
    }

    scoreCard() {
        const {score} = this.props;
        const style = score > 21 ? styles.bust : styles.ok;
        return <span style={style}>{score}</span>;
    }

    render() {
        return (
            <div>            
                <h1>{this.state.name}: {this.scoreCard()}</h1>
                <button onClick={() => {
                    this.props.handleHit(this.props.id);
                }}>hit</button>
                <ul>
                    {this.props.hand.map(card => {
                        return <li key={card.name}>{card.name}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default Player;