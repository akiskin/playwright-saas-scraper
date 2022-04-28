import { Context } from "./types"

export const acquireContextLock = (context: Context): void => {
    if (context.locked) {
        throw "Context is already in use";
    }

    context.locked = true;
}

export const releaseContextLock = (context: Context): void => {
    context.locked = false;
}
