import express from 'express';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';

import { loadScraperRuntime } from '../helper'
import { Context } from '../types';
import Logger from '../logger';
import { WrongCredentials } from '../errors';

const PREFIX = '/scrape'

const addRoutes = (app: express.Application): void => {

    app.post(PREFIX + '/init', body('target').isString(), body('username').isString(), body('password').isString(), async (req: express.Request,res: express.Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const scraper = await loadScraperRuntime(req.body.target.toString())

        const {context, page} = await scraper.init()

        const logger = new Logger();
        scraper.enableLogger(logger);

        const now = new Date();
        const processingContext: Context = {
            id: crypto.randomUUID(),
            contextRef: context,
            pageRef: page,
            created: now,
            lastUsed: now,
            scraper: req.body.target,
            logger: logger
        };
        global.availableContexts.push(processingContext);

        scraper.setContext(processingContext);

        let loginResult: any;
        try {
            loginResult = await scraper.login(req.body);
        } catch(exception) {
            if (exception instanceof WrongCredentials) {
                loginResult = {error: 'Wrong credentials', description: exception.message};
            } else {
                loginResult = {error: 'Unknown error'};
            }
        }

        res.send({
            context: processingContext.id,
            data: loginResult,
        });
    });


    app.get(PREFIX + '/accounts', async (req,res) => {

        const contextId = req.query.context;
        const context = global.availableContexts.find((elem) => elem.id === contextId)

        if (!context) {
            res.sendStatus(404);
            return;
        }

        const scraper = await loadScraperRuntime(context.scraper);
        scraper.enableLogger(context.logger);
        scraper.setContext(context);

        context.lastUsed = new Date();

        const accounts = await scraper.extractAccounts({});

        res.send(accounts);
    });
    

    app.get(PREFIX + '/logout', async (req,res) => {

        const contextId = req.query.context;
        const context = global.availableContexts.find((elem) => elem.id === contextId)

        if (!context) {
            res.sendStatus(404);
            return;
        }

        const scraper = await loadScraperRuntime(context.scraper);
        scraper.enableLogger(context.logger);
        scraper.setContext(context);

        context.lastUsed = new Date();

        await scraper.logout({});

        res.send();
    });
}

export default addRoutes;