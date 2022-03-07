const specials = '!@#$%^&*()_+{}:"<>?|[];\',./`~';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = lowercase.toUpperCase();
const numbers = '0123456789';
const all = specials + lowercase + uppercase + numbers;
String.prototype.pick = function (min: number, max: number) {
    let n,
        chars = '';
    if (typeof max === 'undefined') {
        n = min;
    } else {
        n = min + Math.floor(Math.random() * (max - min));
    }
    for (let i = 0; i < n; i++) {
        chars += this.charAt(Math.floor(Math.random() * this.length));
    }
    return chars;
};
// For more details check  : http://stackoverflow.com/a/962890/464744
String.prototype.shuffle = function () {
    const array = this.split('');
    let tmp,
        current,
        top = array.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array.join('');
};
const generatePassword = () => {
    const password = (
        specials.pick(1) +
        lowercase.pick(1) +
        uppercase.pick(1) +
        all.pick(3, 10)
    ).shuffle();
    return password;
};
const generateDigits = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

export default { generatePassword, generateDigits };
