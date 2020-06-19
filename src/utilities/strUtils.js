export function isEmpty(str) {
  return str == null || str.match(/^ *$/) !== null;
}
