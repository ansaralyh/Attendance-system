// auth.js
import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Authentication failed!');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new Error('Authentication failed!');
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
export const checkUserRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.userRole;

        if (role.includes(userRole)) {
            next();
        } else {
            res.status(403).json({
                message: 'Permission denied',
            });
        }
    };
};


