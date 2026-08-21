import Call from "../models/Call.js";

export const getCallHistory = async (req, res) => {
  try {
    const calls = await Call.find({
      $or: [
        { callerId: req.user._id, receiverId: req.params.userId },
        { callerId: req.params.userId, receiverId: req.user._id },
      ],
    }).sort({ startedAt: -1 }).limit(20);
    res.json({ success: true, calls });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMyCallHistory = async (req, res) => {
  try {
    const me = req.user._id;
    const calls = await Call.find({
      $or: [{ callerId: me }, { receiverId: me }],
    }).sort({ startedAt: -1 }).limit(40);
    res.json({ success: true, calls });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
