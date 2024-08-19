class ValueObject {
    constructor(props) {
        this.props = Object.freeze(props); // Immutable properties
    }

    equals(vo) {
        if (vo === null || vo === undefined) {
            return false;
        }
        return JSON.stringify(this.props) === JSON.stringify(vo.props);
    }
}

module.exports = ValueObject;
