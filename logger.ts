
type LogEntryDataType = "text"|"image/png"

interface LogEntry {
    created: Date
    text: string
    data: string
    type: LogEntryDataType
}

export const ENTRY_TYPE = {
    TEXT: "text",
    PNG: "image/png"
}

class Logger {

    #log: LogEntry[] = []

    add(text: string, data: any, type: LogEntryDataType = 'text') {

        let dataToSave = data;
        if (Buffer.isBuffer(data)) {
            dataToSave = data.toString('base64')
        }

        this.#log.push({
            created: new Date(),
            text,
            data: dataToSave,
            type
        });
    }

    export() {
        return this.#log
    }

}

export default Logger;