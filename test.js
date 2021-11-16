const { EspLoader } = require("./build/index");
const SerialPort = require("serialport");
const { MySerial } = require("./build/node/serial");

const fs = require("fs");
const { sleep } = require("./build/util");

const partitions = [
  {
    name: "bootloader",
    data: fs.readFileSync("./obnizos__esp32w__3.5.0__bootloader.bin"),
    offset: 0x1000,
  },
  {
    name: "partition",
    data: fs.readFileSync("./obnizos__esp32w__3.5.0__partition.bin"),
    offset: 0x8000,
  },
  {
    name: "app",
    data: fs.readFileSync("./obnizos__esp32w__3.5.0.bin"),
    offset: 0x10000,
  },
];

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
  await espTool.setBaudRate(115200, 921600);

  console.log("start erase");
  await espTool.eraseFlash();
  console.log("erased");

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
})();
