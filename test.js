const { EspLoader } = require("./build/index");
const SerialPort = require("serialport");
const { MySerial } = require("./build/node/serial");

(async () => {
  const port = new MySerial("/dev/tty.SLAB_USBtoUART", {
    baudRate: 115200,
    autoOpen: false,
  });
  await port.open();

  const espTool = new EspLoader(
    port
    //   {
    //   updateProgress: updateProgress,
    //   logMsg: logMsg,
    //   debugMsg: debugMsg,
    //   debug: debug,
    // }
  );

  await espTool.connect();

  const chipName = await espTool.chipName();
  const macAddr = await espTool.macAddr();
  console.log("chipName", chipName);
  console.log("macAddr", macAddr);
  await espTool.loadStub();

  await espTool.eraseFlash();
  console.log("erased");
})();
