module.exports = {
    encrypt: function(string) {
        var number = "0x";
        var length = string.length;
        for (var i = 0; i < length; i++)
            number += string.charCodeAt(i).toString(16);
        return number;
    },
    decrypt: function(number) {
        if (number.slice(0, 2) != "0x") {
            // invalid number
            return null;
        }
        var string = "";
        number = number.slice(2);
        var length = number.length;
        for (var i = 0; i < length;) {
            var code = number.slice(i, i += 2);
            string += String.fromCharCode(parseInt(code, 16));
        }
        return string;
    }
};
