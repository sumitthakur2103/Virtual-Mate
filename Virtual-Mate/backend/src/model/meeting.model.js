import mongoose from "mongoose";
const Schema = mongoose.Schema;

const meetingSchema = new Schema(
    {
        host_id: { type: String },
        meetingCode: { type: String },
        date: { type: String, required: true, default: Date.now },
        participants: { type: Array },
        share_id: { type: String }
    }
)

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };