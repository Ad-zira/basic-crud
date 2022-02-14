"use strict";
const randomNumber = () => {
    return Math.floor(Math.random() * 899999 + 100000).toString();
};
module.exports = randomNumber;
