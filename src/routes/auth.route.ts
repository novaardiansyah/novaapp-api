import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";

const router = Router();

router.get("/", AuthController.login);

export default router;