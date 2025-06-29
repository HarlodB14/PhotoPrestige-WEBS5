import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({message: "Geen token, autorisatie mislukt"});

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (err) {
        res.status(401).json({message: "Ongeldige token "});
    }
};
export default authenticate;