import express from 'express';

const PREFIX = '/control'

const addRoutes = (app: express.Application): void => {

    app.get(PREFIX + '/contexts', async (req,res) => {
        res.json(global.availableContexts.map(gc => {
            gc.id,
            gc.created
            gc.scraper}
        ));
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