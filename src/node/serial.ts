import NodeSerialPort from "serialport";
import { ReadableOwner } from "../reader";

export class DummyReader {
  constructor(private serial: MySerial) {}

  read() {
    const value = this.serial.port.read();
    // if (value) {
    //   console.log("data", value);
    //   console.log("str", value.toString());
    // }
    const done = false;
    return { value, done };
  }

  releaseLock() {}

  cancel() {
    this.serial.port.close();
  }
}

export class MySerial implements ReadableOwner {
  port: NodeSerialPort;
  readonly readable: ReadableStream<Uint8Array>;

  constructor(path: string, option: NodeSerialPort.OpenOptions) {
    this.port = new NodeSerialPort(path, option);

    // this.port.on("data", (data: Buffer) => {
    //   console.log("data", data);
    //   console.log("str", data.toString());
    // });
    this.port.on("open", () => {
      // console.log("open");
    });
    this.port.on("error", (error) => {
      console.log("error", error);
    });

    this.port.on("close", (reason: any) => {
      // console.log("close", reason);
    });

    this.readable = {
      getReader: () => {
        const dummyReader = new DummyReader(this);
        return dummyReader as any as ReadableStreamDefaultReader<Uint8Array>;
      },
      cancel: async (reason?: any) => {
        return this.port.close();
      },
    } as any;
  }

  write(data: Uint8Array) {
    const dataArray = Array.from(data);
    // console.log("write", Buffer.from(dataArray));
    return new Promise((resolve, reject) => {
      this.port.write(dataArray, (error: any) => {
        if (error) {
          reject(error);
        }
        resolve(null);
      });
    });
  }

  async setSignals(option: SerialOutputSignals) {
    if (!this.port.isOpen) {
      throw new Error("port is not open");
    }
    const param: Partial<NodeSerialPort.SetOptions> = {};
    if (option.break !== undefined) {
      param.brk = option.break;
    }
    if (option.requestToSend !== undefined) {
      param.rts = option.requestToSend;
    }
    if (option.dataTerminalReady !== undefined) {
      param.dtr = option.dataTerminalReady;
    }
    await this.wait(1);
    return new Promise((resolve, reject) => {
      this.port.set(param, (error) => {
        if (error) {
          reject(error);
        }
        resolve(null);
      });
    });
  }

  setBaudRate(baudRate: number) {
    this.port.update({ baudRate });
  }

  open({ baudRate }: { baudRate?: number } = {}) {
    if (baudRate) {
      this.port.update({ baudRate });
    }
    if (this.port.isOpen) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.port.open((error) => {
        if (error) {
          reject(error);
        }
        resolve(null);
      });
    });
  }

  close() {
    if (!this.port.isOpen) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.port.close((error) => {
        if (error) {
          reject(error);
        }
        resolve(null);
      });
    });
  }

  wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
