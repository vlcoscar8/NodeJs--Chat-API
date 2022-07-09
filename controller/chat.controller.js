import { Chat } from "../models/chat.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";

const chatDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const chat = await Chat.findOne({ id: id })
            .populate("owner")
            .populate("users")
            .populate("comments");

        res.status(200).json(chat);
    } catch (error) {
        next(error);
    }
};

const createChat = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await User.findById(id);
        const chats = await Chat.find();
        const newChat = new Chat({
            id: chats.length + 1,
            owner: owner,
            users: [],
            comments: [],
        });

        await newChat.save();

        const chatCreated = await Chat.findOne({ id: newChat.id });

        await User.findByIdAndUpdate(id, {
            $push: {
                chats: chatCreated,
            },
        });

        res.status(200).json(chatCreated);
    } catch (error) {
        next(error);
    }
};

const addUserToChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { username } = req.body;

        const user = await User.findOne({ username: username });

        await Chat.findOneAndUpdate(
            { id: chatId },
            {
                $push: {
                    users: user,
                },
            }
        );

        const chatUpdated = await Chat.findOne({ id: chatId }).populate(
            "users"
        );

        res.status(200).json(chatUpdated);
    } catch (error) {
        next(error);
    }
};

const deleteUserFromChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { username } = req.body;

        const user = await User.findOne({ username: username });

        await Chat.findOneAndUpdate(
            { id: chatId },
            {
                $pull: {
                    users: user._id,
                },
            }
        );

        const chatUpdated = await Chat.findOne({ id: chatId }).populate(
            "users"
        );

        res.status(200).json(chatUpdated);
    } catch (error) {
        next(error);
    }
};

const addCommentToChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { content, username } = req.body;

        const user = await User.findOne({ username: username });
        const comments = await Comment.find();

        const newComment = new Comment({
            id: comments.length + 1,
            chatId: chatId,
            from: [user],
            content: content,
        });
        await newComment.save();

        const commentCreated = await Comment.findOne({
            id: comments.length + 1,
        });

        await Chat.findOneAndUpdate(
            { id: chatId },
            {
                $push: {
                    comments: commentCreated,
                },
            }
        );

        const chatUpdated = await Chat.findOne({ id: chatId }).populate(
            "comments"
        );

        res.status(200).json(chatUpdated);
    } catch (error) {
        next(error);
    }
};

const deleteCommentFromChat = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { chatId } = req.body;

        const comment = await Comment.findOne({ id: commentId });

        await Chat.findOneAndUpdate(
            { id: chatId },
            {
                $pull: {
                    comments: comment._id,
                },
            }
        );

        await comment.remove();

        const chatUpdated = await Chat.findOne({ id: chatId });

        res.status(200).json(chatUpdated);
    } catch (error) {
        next(error);
    }
};

export {
    createChat,
    chatDetail,
    addUserToChat,
    deleteUserFromChat,
    addCommentToChat,
    deleteCommentFromChat,
};
