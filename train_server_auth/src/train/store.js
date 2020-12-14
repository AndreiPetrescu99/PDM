import dataStore from 'nedb-promise';

export class TrainStore {
    constructor({ filename, autoload }) {
        this.store = dataStore({ filename, autoload });
    }


    async find(props) {
        return this.store.find(props);
    }

    async findOne(props) {
        return this.store.findOne(props);
    }

    async insert(note) {
        return this.store.insert(note);
    };

    async update(props, note) {
        return this.store.update(props, note);
    }

    async remove(props) {
        return this.store.remove(props);
    }
}

export default new TrainStore({ filename: './db/trains.json', autoload: true });