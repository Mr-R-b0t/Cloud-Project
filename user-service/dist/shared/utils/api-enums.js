"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleWeight = exports.UserRoles = void 0;
var UserRoles;
(function (UserRoles) {
    UserRoles["super_admin"] = "super_admin";
    UserRoles["admin"] = "admin";
    UserRoles["staff"] = "staff";
    UserRoles["student"] = "student";
    UserRoles["pending"] = "pending";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
var RoleWeight;
(function (RoleWeight) {
    RoleWeight[RoleWeight["super_admin"] = 0] = "super_admin";
    RoleWeight[RoleWeight["admin"] = 1] = "admin";
    RoleWeight[RoleWeight["staff"] = 2] = "staff";
    RoleWeight[RoleWeight["student"] = 3] = "student";
    RoleWeight[RoleWeight["pending"] = 4] = "pending";
})(RoleWeight || (exports.RoleWeight = RoleWeight = {}));
//# sourceMappingURL=api-enums.js.map