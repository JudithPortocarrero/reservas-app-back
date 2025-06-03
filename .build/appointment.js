"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const register = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Funciona!" }),
    };
};
exports.register = register;
