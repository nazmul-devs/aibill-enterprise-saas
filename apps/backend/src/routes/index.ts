import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        timestamp: new Date().toISOString(),
    });
});

// router.use("/users", userRoutes);
// router.use("/auth", authRoutes);
// router.use("/bookings", bookingRoutes);
// router.use("/payments", paymentRoutes);

export default router;