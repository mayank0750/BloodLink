import Messaging from "../models/Messaging.js";

export const createMessage = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // Validation
    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save to DB
    const contact = await Messaging.create({
      name,
      phone,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact,
    });
    console.log("Message created:", contact);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
    console.log("Error creating message:", error);
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Messaging.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.log("Error fetching messages:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Messaging.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await Messaging.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting message:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};