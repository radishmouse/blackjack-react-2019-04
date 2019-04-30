
export default class Card {
    constructor(name, value) {
        this.name = name;
        this.value = value;
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