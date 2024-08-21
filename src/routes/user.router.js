import {Router} from "express";
import {userService} from "../factory/user.factory.js";

const router = Router();

router.post("/premium/:uid", async (req, res) => {
  try {
    const user = await userService.togglePremium(req.params.uid);
    res.status(200).json({message: "Usuário modificado.", payload: user});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

export default router;
