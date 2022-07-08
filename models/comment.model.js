import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    id: { type: Number, required: true },
    chatId: { type: Number, required: true },
    from: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    content: { type: String, required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

export { Comment };
