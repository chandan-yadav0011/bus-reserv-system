const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
       const {token} = req.cookies; 
       

        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized", error: err.message });
    }
};

module.exports = auth;
