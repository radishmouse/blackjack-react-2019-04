import Card from './Card';
import {randInt} from './utils';
const SUITS = [
    'H',
    'C',
    'S',
    'D'
];
const FACES = [
    'A',        // Not correctly implemented yet.
    'K',
    'Q',
    'J',
    '10',
    ...('23456789'.split('')),
];

export default class Deck {
    constructor() {

        this.cards = [];
        SUITS.forEach(suit => {
            FACES.forEach(face => {
                this.cards.push(`${face}${suit}`);
            });
        });
        console.log(`new Deck with ${this.cards.length} cards`);
        console.log(this.cards);
    }

    static valueOfCard(card) {
        // it's a 10 card
        if (card.name.length === 3) {
            return 10;
        } else {
            const firstChar = card.name[0];
            if ('23456789'.includes(firstChar)) {
                return parseInt(firstChar);
            } else if ('KQJ'.includes(firstChar)) {
                return 10;
            } else {
                // return -1; // it's an ace, which is special.
                return 11; // it's an ace, which is special.
            }
        }
    }

    static valueOfHand(hand) {
        // assumes that hands are arrays of Card instances
        let handVal = 0;
        hand.forEach(card => handVal += card.value);
        return handVal;
        // let handVal = 0;
        // const handHasAce = Deck.hasAce(hand);

        // if (!handHasAce) {
        //     // sum the values
        //     hand.forEach(card => handVal += card.value);
        // } else {
        //     throw new Error('ACES NOT IMPLEMENTED');
        //     const aces = hand.filter(c => c.isAce());
        //     const withoutAces = hand.filter(c => !c.isAce());

        //     const valueWithoutAces = withoutAces.reduce((sum, card) => card.value, 0);
            
        // }
        // return handVal;
    }

    static hasAce(hand) {
        let hasAnAce = false;
        for (let i=0; i< hand.length; i++) {
            if (hand[i].name.toLowerCase().startsWith('a')) {
                hasAnAce = true;
            }
        }
        return hasAnAce;
    }

    static doesBeat(hand1, hand2) {
        const hand1Val = Deck.valueOfHand(hand1);
        const hand2Val = Deck.valueOfHand(hand2);
        if (hand1Val > hand2Val) {
            return 1;
        } else if (hand1Val < hand2Val) {
            return -1;
        } else {
            return 0;
        }
    }

    randomCard() {
        const index = randInt(this.cards.length);
        const aCard = this.cards[index];
        const cardInstance = new Card(aCard);
        console.log(aCard);
        cardInstance.value = Deck.valueOfCard(cardInstance);
        return cardInstance;
    }

    deal() {
        const theCard = this.randomCard();
        this.cards = [
            // oh...this is ugly...
            ...this.cards.filter(c => theCard.isNot(new Card(c)))
        ];
        return theCard;
    }
}