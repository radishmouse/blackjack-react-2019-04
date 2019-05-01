import React from 'react';
import axios from 'axios';
import {randInt} from './utils';

// We're pulling names from an API
const NAMES_URL = 'https://my-little-cors-proxy.herokuapp.com/http://names.drycodes.com/10?nameOptions=girl_names';


// Minimal amount of styling
const styles = {
    bust: {
        color: 'red'
    },
    ok: {
        color: 'black'
    }
}

async function fetchFreshNames() {
    const {data} = await axios.get(NAMES_URL);
    return data;
}

async function getRandomName() {
    let data = [];
    const key = 'names';
    // try localStorage
    let namesInStorage = localStorage.getItem(key);
    if (namesInStorage) {
        // Found some! Let's use them.
        namesInStorage = JSON.parse(namesInStorage);
        data = [...namesInStorage];

        // Grab some more, but don't make uas wait
        if (namesInStorage.length < 100) {
            fetchFreshNames()
                .then(newNames => {
                    localStorage.setItem(key, JSON.stringify([...newNames, ...namesInStorage]));
                });
        }        
    } else {
        // Nothing in localStorage, let's go shopping!
        const newNames = await fetchFreshNames();
        // Save for later...
        localStorage.setItem(key, JSON.stringify([...newNames]));
        // and use them now.
        data = [...newNames];
    }

    // Grab a random one.
    const idx = randInt(data.length);
    const name = data[idx];

    // Strip out the underscore.
    return name.replace('_', ' ');
}

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    // Set this player's name dynamically from an API
    async componentDidMount() {
        // const {data} = await axios.get(NAMES_URL);        
        // console.log(getRandomName());
        
        this.setState({
            name: await getRandomName()
        })
    }

    // Render this player with a styled score.
    // Hides the 'hit me' button if they've busted.
    render() {
        return (
            <div>            
                <h1>{this.state.name}: {this._scoreCard()}</h1>
                {
                    this.props.handleHit ? 
                        <button onClick={() => {
                            this.props.handleHit(this.props.id);
                        }}>hit</button>
                        :
                        <h2>💩</h2>
                }
                <ul>
                    {this.props.hand.map(card => {
                        return <li key={card.name}>{card.name}</li>
                    })}
                </ul>
            </div>
        );
    }

    // A function that will style our score differently based on
    // whether we've busted.
    // Uses the style object defined near the top of the file.
    _scoreCard() {
        const {score} = this.props;
        const style = score > 21 ? styles.bust : styles.ok;
        return <span style={style}>{score}</span>;
    }

}

export default Player;