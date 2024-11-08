export const log = (msg, type, where) => {
  const time = new Date().toISOString();
  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";
  if (type === "error") {
    console.log(`[${time}]: ${where}: ${red} ${msg}${reset}`);
    return;
  }
  if (type === "success") {
    console.log(`[${time}]: ${where}: ${green}${msg}${reset}`);
    return;
  }
  if (type === "warning") {
    console.log(`[${time}]: ${where}: ${yellow}${msg}${reset}`);
    return;
  }
  if (type === "info") {
    console.log(`[${time}]: ${where}: ${msg}`);
    return;
  }
  console.log(`[${time}]: ${msg}`);
};
