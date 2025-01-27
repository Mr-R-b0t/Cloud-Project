"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const http_proxy_middleware_1 = require("http-proxy-middleware");
let GatewayModule = class GatewayModule {
    configure(consumer) {
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://localhost:3001',
            changeOrigin: true,
        }))
            .forRoutes('/users');
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://localhost:3002',
            changeOrigin: true,
        }))
            .forRoutes('/properties');
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://localhost:3003',
            changeOrigin: true,
        }))
            .forRoutes('/investements');
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://localhost:3004',
            changeOrigin: true,
        }))
            .forRoutes('/payments');
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://localhost:3005',
            changeOrigin: true,
        }))
            .forRoutes('/notifications');
    }
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({})
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map