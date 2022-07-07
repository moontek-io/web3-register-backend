module.exports.generate = (length = 4) => {
    let min = 1;
    let max = 9;
    for (let i = 1; i < length; i += 1) {
        min += '0';
        max += '9';
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}