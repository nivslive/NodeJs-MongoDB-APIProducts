import express from 'express'
import User from '../models/User'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UsersController from '../controllers/users';

const express = express();
const router = express.Router();


router.post('/singup', UsersController.singup);


router.post('/login', UsersController.login)


router.delete('/', UsersController.delete)