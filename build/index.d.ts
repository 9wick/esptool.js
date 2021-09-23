import { Stub } from "./stubs";
export declare enum ChipFamily {
    ESP32 = "esp32",
    ESP8266 = "esp8266",
    ESP32S2 = "esp32S2"
}
export declare const ESP_ROM_BAUD = 115200;
export declare type EspLoaderOptions = {
    flashSize: number;
    logger: Logger;
    debug: boolean;
};
export interface Logger {
    debug(message?: unknown, ...optionalParams: unknown[]): void;
    log(message?: unknown, ...optionalParams: unknown[]): void;
    error(message?: unknown, ...optionalParams: unknown[]): void;
}
declare type progressCallback = (i: number, total: number) => void;
export declare class EspLoader {
    private _chipfamily;
    private _efuses;
    private options;
    private serialPort;
    private isStub;
    private closed;
    private readLoopPromise;
    private serialReader;
    private inputBuffer;
    constructor(serialPort: SerialPort, options?: Partial<EspLoaderOptions>);
    private get logger();
    private writeToStream;
    /**
     * Start the read loop up.
     */
    connect(rebootWaitMs?: number): Promise<void>;
    private _connect;
    /**
     * shutdown the read loop.
     */
    disconnect(): Promise<void>;
    /**
     * @name macAddr
     * Read MAC from OTP ROM
     */
    macAddr(): Promise<Uint8Array>;
    /**
     * Read the OTP data for this chip.
     */
    private readEfuses;
    private efuses;
    /**
     * Read a register within the ESP chip RAM.
     */
    private readRegister;
    /**
     * ESP32, ESP32S2 or ESP8266 based on which chip type we're talking to.
     */
    chipFamily(): Promise<ChipFamily>;
    /**
     * The specific name of the chip.
     */
    chipName(): Promise<string>;
    /**
     * Send a command packet, check that the command succeeded.
     */
    private checkCommand;
    private _sendCommandBuffer;
    private sendCommand;
    private getResponse;
    private readBuffer;
    private readLoop;
    private static checksum;
    /**
     * Change the baud rate for the serial port.
     */
    setBaudRate(prevBaud: number, baud: number): Promise<void>;
    /**
     * Put into ROM bootload mode & attempt to synchronize with the
     * ESP ROM bootloader, we will retry a few times
     */
    sync(): Promise<void>;
    private _sync;
    private getFlashWriteSize;
    /**
     * Write data to the flash.
     */
    flashData(binaryData: Uint8Array, offset?: number, progressCallback?: progressCallback | undefined, encrypted?: boolean): Promise<void>;
    private _flashBlockBuffer;
    private flashBlock;
    private flashBegin;
    /**
     * Leave flash mode and run/reboot
     *
     * @param reboot wheather or not to reboot
     */
    flashFinish(reboot?: boolean): Promise<void>;
    /**
     * Calculate an erase size given a specific size in bytes.
     * Provides a workaround for the bootloader erase bug.
     */
    private static getEraseSize;
    private memBegin;
    private _memBlockBuffer;
    private memBlock;
    private memFinish;
    /**
     * loads the stub onto the device.
     *
     * @param stub Stub to load
     */
    loadStub(stub?: Stub): Promise<void>;
    /**
     * erase the flash of the device
     *
     * @param timeoutMs the timeout of erasing
     */
    eraseFlash(timeoutMs?: number): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map