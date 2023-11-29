export const ignoreContent: KeyArrayValue = {
    "js": [
        "<EOF>"
    ]
};

export const preRuleContent: KeyObjectValue = {
    "html": {
        "htmlAttribute": " "
    },
    "js": {
        "importNamespace": " ",
        "CloseBrace": " "
    }
};

export const postRuleContent: KeyObjectValue = {
    "js": {
        "eos": "\n",
        "importNamespace": " ",
        "varModifier": " ",
        "From": " ",
        "Function_": " ",
        "New": " ",
        "OpenBrace": " ",
    }
};

type KeyArrayValue = {
    [key: string]: string[];
};

type KeyObjectValue = {
    [key: string]: {
        [key: string]: string;
    };
};