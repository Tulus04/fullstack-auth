const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const auth = require("../middleware/auth");

// Semua route item memerlukan authentication
router.post("/", auth, itemController.createItem);
router.get("/", auth, itemController.getAllItems);
router.get("/:id", auth, itemController.getItemById);
router.put("/:id", auth, itemController.updateItem);
router.delete("/:id", auth, itemController.deleteItem);

module.exports = router;
