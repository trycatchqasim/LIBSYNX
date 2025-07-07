const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportController");
router.use(express.urlencoded({ extended: true }));

module.exports = router;

//get all borrowings
router.get("/borrowings", reportsController.getAllBorrowings);

//get all notifciations
router.get("/notifications", reportsController.getAllNotifications);

//get overdue books
router.get("/overdue", reportsController.getOverdueBooks);

router.post("/insert/notifications", reportsController.insertNotification);

router.post(
  "/insert/notifications/all",
  reportsController.insertNotificationForAllUsers
);

router.delete(
  "/delete/notifications/:id",
  reportsController.DeleteNotification
);
