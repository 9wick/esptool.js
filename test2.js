const { EspLoader } = require("./build/index");
const SerialPort = require("serialport");
const { MySerial } = require("./build/node/serial");

(async () => {
  const port = new SerialPort("/dev/tty.SLAB_USBtoUART", {
    baudRate: 115200,
    autoOpen: false,
  });
  port.open(() => {
    port.set({ dtr: true }, () => {
      console.log("done");
    });
  });
})();
