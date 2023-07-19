import { createUser, deleteUser, getAllUsers, getOneUser, updateUser } from "../services/users.service.js";

export const usersController = {
    getAllUsers: getAllUsers,
    createUser: createUser,
    getOneUser: getOneUser,
    updateUser: updateUser,
    deleteuser: deleteUser
}