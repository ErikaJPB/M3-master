const commands = require("./commands/index.js");

const print = (input) => {
  process.stdout.write(input + "\n");
  process.stdout.write("promp > ");
};

process.stdout.write("prompt > ");

process.stdin.on("data", (data) => {
  let args = data.toString().trim().split(" ");
  let cmd = args.shift();

  //trim -> quita espacios que esten de mas, principio y final

  // if (cmd === "echo") {}
  // if (cmd === "ls") {}
  // if (cmd === "date") {}

  commands[cmd] ? commands[cmd](args, print) : print("command not found");
});

// process. stdout.write(cmd + "\n");
//process.stdout.write("prompt > ");

// process.stdout.write(data)

// process.stdout.write("prompt > ");
