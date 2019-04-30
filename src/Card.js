
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

    isAce() {
        return this.name[0].toLowerCase() === 'a';
    }
}