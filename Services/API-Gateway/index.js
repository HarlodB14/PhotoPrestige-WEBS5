import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {createProxyMiddleware} from 'http-proxy-middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.disable('x-powered-by');

const services = [
    {route: '/target', target: process.env.TARGET_SERVICE_URL || 5005},
    // { route: '/mail', target: process.env.MAIL_SERVICE_URL },
    // { route: '/score', target: process.env.SCORE_SERVICE_URL },
    // { route: '/clock', target: process.env.CLOCK_SERVICE_URL },
    // { route: '/read', target: process.env.READ_SERVICE_URL },
    {
        route: '/register',
        target: process.env.REGISTER_SERVICE_URL || 5007,
        pathRewrite: {'^/register': ''}
    },
    {route: '/users', target: process.env.USERS_SERVICE_URL || 5006},
    {route: '/auth', target: process.env.AUTH_SERVICE_URL || 5006},
];

services.forEach(({route, target, pathRewrite}) => {
    const options = {
        target,
        changeOrigin: true,
        onProxyReq: (proxyReq) => {
            const authHeader = proxyReq.getHeader('authorization') ||
                proxyReq.getHeader('Authorization');
            if (authHeader) proxyReq.setHeader('Authorization', authHeader);
        }
    };

    if (pathRewrite) options.pathRewrite = pathRewrite;

    app.use(route, createProxyMiddleware(options));
});

const PORT = process.env.PORT || 5000;
// Add this before app.listen()
app.get('/health', (req, res) => {
    res.status(200).json({status: 'healthy'});
});
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));