import { login, logout, protect } from "../services/auth.service.js"
export const authController = {
    login: login,
    logout: logout,
    protect: protect,
}