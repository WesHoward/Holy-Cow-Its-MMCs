var decoded = {
    'A': '-',
    'B': 'P',
    'C': '2',
    'D': 'K',
    'E': 'H',
    'F': 'd',
    'G': '7',
    'H': 'Z',
    'I': 'G',
    'J': '3',
    'K': 's',
    'L': '1',
    'M': '4',
    'N': 'W',
    'O': 'R',
    'P': 'V',
    'Q': 'h',
    'R': 'q',
    'S': 'm',
    'T': 'a',
    'U': 'J',
    'V': 'e',
    'W': '8',
    'X': 'r',
    'Y': 'Q',
    'Z': 'U',
    'a': 'z',
    'b': '_',
    'c': 'g',
    'd': 'p',
    'e': 'w',
    'f': 'u',
    'g': 'T',
    'h': 't',
    'i': 'b',
    'j': 'X',
    'k': 'L',
    'l': 'k',
    'm': 'F',
    'n': 'E',
    'o': 'B',
    'p': '5',
    'q': '6',
    'r': 'y',
    's': 'l',
    't': 'f',
    'u': 'A',
    'v': 'M',
    'w': 'c',
    'x': '0',
    'y': 'Y',
    'z': 'O',
    '-': 'C',
    '_': 'j',
    '1': 'v',
    '2': 'n',
    '3': 'N',
    '4': 'S',
    '5': 'D',
    '6': 'x',
    '7': 'I',
    '8': 'o',
    '9': '9',
    '0': 'i',
    '{': '{',
    '}': '}',
    '$': '$'
};

function ceaserCipher(str) {

    var decipher = '';
    for (let i = 0; i < str.length; i++) {
        decipher += decoded[str[i]];
    }

    return decipher;
};