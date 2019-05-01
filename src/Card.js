
// A Card class that can compare itself to another Card.
// Can also tell you if the card is an ace.
export default class Card {
    constructor(name) {
        this.name = name;
        // this.value = value;
    }

    // assumes that card names are unique
    is(otherCard) {
        return this.name === otherCard.name;
    }

    isNot(otherCard) {
        return !this.is(otherCard);
    }

    get isAce() {
        return this.name[0].toLowerCase() === 'a';
    }

    get value() {
        // it's a 10 card
        if (this.name.length === 3) {
            return 10;
        } else {
            const firstChar = this.name[0];
            if ('23456789'.includes(firstChar)) {
                return parseInt(firstChar);
            } else if ('KQJ'.includes(firstChar)) {
                return 10;
            } else {                
                return 11; // Aces are 11, but can be adjusted in the context of other cards.
            }
        }        
    }
}