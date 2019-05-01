import Card from './Card';

// Random int function for pulling a random card from the deck.
import {randInt} from './utils';

// Arrays used for generating card names.
const SUITS = [
    'H',
    'C',
    'S',
    'D'
];
const FACES = [
    'A',
    'K',
    'Q',
    'J',
    '10',
    ...('23456789'.split('')),  // Because I didn't feel like typing them as separate strings
];

export default class Deck {
    constructor() {
        this.cards = [];

        // Generate our cards.
        SUITS.forEach(suit => {
            FACES.forEach(face => {
                this.cards.push(`${face}${suit}`);
            });
        });
        // console.log(`new Deck with ${this.cards.length} cards`);
        // console.log(this.cards);
    }

    // Method for counting aces in a hand.
    static howManyAces(hand) {
        let howMany = 0;
        for (let i=0; i< hand.length; i++) {
            if (hand[i].isAce) {
                howMany++;
            }
        }
        return howMany;
    }


    // Calculate the numeric value of a hand,
    // adjusting for aces, if the total value is over 21.
    static valueOfHand(hand) {
        // assumes that hands are arrays of Card instances
        const acesInHand = Deck.howManyAces(hand);
        let handVal = 0;
        hand.forEach(card => handVal += card.value);
        for (let i = 0; i<acesInHand; i++) {
            if (handVal > 21) {
                handVal -= 10;  // adjust down for aces
            }
        }
        
        return handVal;
    }

    // Currently unused.
    // Helper function for sorting hands by score.
    static UNUSED_doesBeat(hand1, hand2) {
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

    // Pulls a random card from the deck.
    randomCard() {
        const index = randInt(this.cards.length); // random int from 0 to .length
        const aCard = this.cards[index];
        const cardInstance = new Card(aCard);     // convert it to a Card instance.
        console.log(aCard);
        return cardInstance;
    }

    // Removes and returns a random card from the deck.
    deal() {
        const theCard = this.randomCard();  // Grab a random one.
        this.cards = [
            // oh...this is ugly...
            ...this.cards.filter(c => theCard.isNot(new Card(c)))  // Keep every card other than the one I pulled.
        ];
        return theCard;
    }
}