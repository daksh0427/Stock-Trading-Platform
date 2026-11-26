import { Router } from "express";
import { buystock, deleteUser, getAllTransactionHistory, getAllUserStocks, getBoard, getWallet, loginUser, logoutUser, refreshAccessToken, registerUser, sellStock } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import rateLimiter from "../utils/rateLimiter.js";

const router=Router()
router.post("/register", rateLimiter({capacity:30, refillRate:5}), registerUser)
router.post("/login", rateLimiter({capacity:30, refillRate:5}), loginUser)
router.post("/delete", verifyJWT, rateLimiter({capacity:10, refillRate:1}), deleteUser)
router.post("/logout", verifyJWT, rateLimiter({capacity:30, refillRate:5}), logoutUser)
router.post("/refresh-token", rateLimiter({capacity:30, refillRate:5}), refreshAccessToken)
router.post("/buy-stock", verifyJWT, rateLimiter({capacity:60, refillRate:10}), buystock)
router.get("/get-all-stocks", verifyJWT, rateLimiter({capacity:60, refillRate:10}), getAllUserStocks)
router.get("/get-all-trans", verifyJWT, rateLimiter({capacity:60, refillRate:10}), getAllTransactionHistory)
router.patch("/sell-stock", verifyJWT, rateLimiter({capacity:60, refillRate:10}), sellStock)
router.post("/sell-stock", verifyJWT, rateLimiter({capacity:60, refillRate:10}), sellStock)
router.get("/leaderboard", verifyJWT, rateLimiter({capacity:60, refillRate:10}), getBoard)
router.patch("/leaderboard", verifyJWT, rateLimiter({capacity:60, refillRate:10}), getBoard)
router.get("/get-wallet", verifyJWT, rateLimiter({capacity:60, refillRate:10}), getWallet)
export {router as userRouter};