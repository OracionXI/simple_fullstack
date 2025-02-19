import express from 'express';
import { createUser, deleteUser, getUser, getUsers, testUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test',testUser);

router.get('/',getUsers);
router.get('/:id',getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post("/save", createUser);

export default router;