require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.disable("x-powered-by");

const services = [
    { route: "/target", target: process.env.TARGET_SERVICE_URL },
    { route: "/mail", target: process.env.MAIL_SERVICE_URL },
    { route: "/score", target: process.env.SCORE_SERVICE_URL },
    { route: "/clock", target: process.env.CLOCK_SERVICE_URL },
    { route: "/read", target: process.env.READ_SERVICE_URL },
    { route: "/register", target: process.env.REGISTER_SERVICE_URL },
    { route: "/users", target: process.env.USERS_SERVICE_URL },
    { route: "/auth", target: process.env.AUTH_SERVICE_URL },
];

// Apply proxy middleware
services.forEach(({ route, target }) => {
    app.use(route, createProxyMiddleware({ target, changeOrigin: true }));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));
