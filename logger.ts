interface LogEntry {
    created: Date
    text: string
    data: string
    type: "text"|"image/png"
}

export const ENTRY_TYPE = {
    TEXT: "text",
    PNG: "image/png"
}

class Logger {

    #log: LogEntry[] = []

    add(text: string, data: any, type: string = 'text') {

        let dataToSave = data;
        if (Buffer.isBuffer(data)) {
            dataToSave = data.toString('base64')
        }

        this.#log.push({
            created: new Date(),
            text,
            data: dataToSave,
            type: type as unknown as "text"|"image/png"
        });
    }

    export() {
        return this.#log
    }

}

export default Logger;