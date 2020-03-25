class Time {
    constructor(options){
        this.options = Object.assign({}, options);
    }

    init(){
        return this.options;
    };
}

const create = (options = {}) => {
    return new Time(options);
};

module.exports = create;
