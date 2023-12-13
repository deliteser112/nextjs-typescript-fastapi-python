// jwtUtils.ts

import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
    name: string;
    email: string;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        const decoded = jwt.decode(token) as DecodedToken;
        return decoded.user;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
