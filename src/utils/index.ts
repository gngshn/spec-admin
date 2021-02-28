export function makeString(num: number, length: number) {
  let str = num.toString(16);
  if (str.length < length) {
    return "0x" + "0".repeat(length - str.length) + str;
  } else {
    return "0x" + str;
  }
}