class DBcache {
    constructor() {
        this.cache = {};
    }

    get(key) {
        return this.cache[key];
    }

    set(key, value) {
        this.cache[key] = value;
    }

    has(key) {
        return this.cache.hasOwnProperty(key);
    }

    delete(key) {
        delete this.cache[key];
    }

    clear() {
        this.cache = {};
    }
}

module.exports = DBcache;