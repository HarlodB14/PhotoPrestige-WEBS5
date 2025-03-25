const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("autorisatie");
    if (!token) return res.status(401).json({ message: "Geen token, autorisatie mislukt" });

    try {
        req.user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: "invalide token" });
    }
};
