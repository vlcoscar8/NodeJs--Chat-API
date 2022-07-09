import { User } from "../models/user.model.js";

const userDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).populate("chats");

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const allUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export { userDetail, allUsers };
