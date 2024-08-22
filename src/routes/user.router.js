import {Router} from "express";
import {userService} from "../factory/user.factory.js";
import {documentsUpload} from "../config/multer.config.js";
import {checkAuth} from "../middleware/auth.js";

const router = Router();

router.post("/premium/:uid", checkAuth, async (req, res) => {
  try {
    const user = await userService.togglePremium(req.params.uid);
    req.session.user.role = user.role;
    res.redirect('/profile')
  } catch (e) {
    req.logger.error(e.message);
    res.redirect('/profile')
  }
});

router.post("/:uid/documents", checkAuth, documentsUpload.any() ,async (req, res) => {
  try {
    for (const file of req.files) {
      await userService.addDocument(req.params.uid, {
        name: file.originalname,
        reference: `uploads/documents/${req.params.uid}-${file.originalname}`
      });
    }
    res.redirect('/profile')
  } catch (e) {
    req.logger.error(e.message);
    res.redirect('/profile')
  }
});

export default router;
