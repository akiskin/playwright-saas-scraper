import express from 'express';
import { destroyContext, destroyOldContexts } from '../helper';

const PREFIX = '/control'

const addRoutes = (app: express.Application): void => {

    app.get(PREFIX + '/contexts', async (req,res) => {
        res.json(global.availableContexts.map(gc => { return {
            id: gc.id,
            created: gc.created,
            lastUsed: gc.lastUsed,
            scraper: gc.scraper}
        }));
    });

    app.delete(PREFIX + '/contexts/:contextId', async (req,res) => {

        const context = global.availableContexts.find((elem) => elem.id === req.params.contextId)

        if (!context) {
            res.sendStatus(404);
            return;
        }

        await destroyContext(context);

        res.status(200).send();
    });

    app.post(PREFIX + '/contexts/destroy/old', async (req,res) => {
        const numberOfDestroyed = await destroyOldContexts();
        res.json({destroyed: numberOfDestroyed});
    });

    app.get(PREFIX + '/log', async (req,res) => {
        
        const contextId = req.query.context;
        const context = global.availableContexts.find((elem) => elem.id === contextId)

        if (!context) {
            res.sendStatus(404);
            return;
        }

        res.json(context.logger.export());
    });
}

export default addRoutes;