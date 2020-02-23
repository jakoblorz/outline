// @flow
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import Router from 'koa-router';
import validation from '../middlewares/validation';

import slack from './slack';
import google from './google';
import discord from './discord';

const auth = new Koa();
const router = new Router();

router.use('/', slack.routes());
router.use('/', google.routes());
router.use('/', discord.routes());

auth.use(bodyParser());
auth.use(validation());
auth.use(router.routes());

export default auth;
