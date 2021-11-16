const { EspLoader } = require("./build/index");
const SerialPort = require("serialport");
const { EsptoolSerial } = require("./build/node/serial");

const fs = require("fs");
const { sleep } = require("./build/util");
var wtf = require("wtfnode");

(async () => {
  const port = new EsptoolSerial("/dev/tty.SLAB_USBtoUART", {
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
  await espTool.setBaudRate(115200, 921600);

  console.log("start erase");
  await espTool.eraseFlash();
  console.log("erased");
  await espTool.disconnect();
  // await port.close();
  wtf.dump();
  return;

  for (let i = 0; i < partitions.length; i++) {
    console.log("\nWriting partition: " + partitions[i].name);
    await espTool.flashData(partitions[i].data, partitions[i].offset, function (idx, cnt) {
      console.log(partitions[i].name, idx, cnt);
    });
    await sleep(100);
  }
  console.log("successfully written device partitions");
  console.log("flashing succeeded");
  await port.close();
  console.log("closed");
})();
