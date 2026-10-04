import { Request, Response } from "express";
import Contact from "../models/Contact";

const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const normalizeSpaces = (value: string): string => {
  return value
    .trim()
    .replace(/\s+/g, " ");
};

export const createContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      message,
      website,
    } = req.body ?? {};

    /*
     * Honeypot:
     * Real users should never send this field.
     */
    if (
      typeof website === "string" &&
      website.trim() !== ""
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid request.",
      });
      return;
    }

    /*
     * Type validation
     */
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid form data.",
      });
      return;
    }

    /*
     * Clean input
     */
    const cleanName = normalizeSpaces(name);
    const cleanEmail = email
      .trim()
      .toLowerCase();
    const cleanMessage = message.trim();

    /*
     * NAME
     */
    if (!cleanName) {
      res.status(400).json({
        success: false,
        message: "Name is required.",
      });
      return;
    }

    if (cleanName.length < 2) {
      res.status(400).json({
        success: false,
        message:
          "Name must be at least 2 characters.",
      });
      return;
    }

    if (cleanName.length > 60) {
      res.status(400).json({
        success: false,
        message:
          "Name must be less than 60 characters.",
      });
      return;
    }

    if (!NAME_REGEX.test(cleanName)) {
      res.status(400).json({
        success: false,
        message:
          "Name can contain letters, spaces, hyphens and apostrophes only.",
      });
      return;
    }

    /*
     * EMAIL
     */
    if (!cleanEmail) {
      res.status(400).json({
        success: false,
        message: "Email is required.",
      });
      return;
    }

    if (cleanEmail.length > 254) {
      res.status(400).json({
        success: false,
        message:
          "Email address is too long.",
      });
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
      return;
    }

    /*
     * MESSAGE
     */
    if (!cleanMessage) {
      res.status(400).json({
        success: false,
        message: "Message is required.",
      });
      return;
    }

    if (cleanMessage.length < 10) {
      res.status(400).json({
        success: false,
        message:
          "Message must be at least 10 characters.",
      });
      return;
    }

    if (cleanMessage.length > 1000) {
      res.status(400).json({
        success: false,
        message:
          "Message must be less than 1000 characters.",
      });
      return;
    }

    /*
     * Save only validated data
     */
    const contact = await Contact.create({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    res.status(201).json({
      success: true,
      message:
        "Message saved successfully.",
      data: {
        id: contact._id,
      },
    });
  } catch (error) {
    console.error(
      "Contact error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to save contact message.",
    });
  }
};