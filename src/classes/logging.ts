/**
 * Logs messages to the console
 */
export class Logger {
    static debugMode = false;
    /**
     * Logs an INFO message to the console
     * @param {String} message The message to write to the console
     */
    static info(message: string) {
        if (message) {
            console.info("%cSimple Calendar", "color:blue;", ` | ${message}`);
        }
    }

    /**
     * Logs a WARNING message to the bots log file
     * @param {String} message The message to write to the log
     */
    static warn(message: string) {
        if (message) {
            console.warn("%cSimple Calendar", "color:orange;", ` | ${message}`);
        }
    }

    /**
     * Logs an ERROR message to the bots log file
     * @param {String|Error} message The message to write to the log file
     */
    static error(message: string | Error) {
        if (message instanceof Error) {
            console.error("%cSimple Calendar", "color:red;", ` | Error "${message.message}"\n${message.stack}`);
        } else {
            console.error("%cSimple Calendar", "color:red;", ` | ${message}`);
        }
    }

    /**
     * Logs debug messages if debugging is turned on
     * @param {String} message The message to write to the console
     */
    static debug(message: string) {
        if (message && Logger.debugMode) {
            console.debug("%cSimple Calendar", "color:green;", ` | ${message}`);
        }
    }
}
