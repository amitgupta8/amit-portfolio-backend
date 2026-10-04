import { Router } from "express";

import {
  createContact,
} from "../controllers/contactRoutes";

const router = Router();

router.post("/", createContact);

export default router;