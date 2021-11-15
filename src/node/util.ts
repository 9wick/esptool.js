export function atobuff(base64: string): Buffer {
  const buf = Buffer.from(base64, "base64");
  return buf;
}

export function atob(base64: string): string {
  if (typeof window !== "undefined" && window.atob) {
    return window.atob(base64);
  } else if (typeof Buffer !== "undefined") {
    const buf = Buffer.from(base64, "base64");
    const ascii: string = buf.toString("ascii");
    return ascii;
  }
  throw new Error("unsupported environment");
}

export function btoa(ascii: string): string {
  if (typeof window !== "undefined" && window.atob) {
    return window.btoa(ascii);
  } else if (typeof Buffer !== "undefined") {
    const buf = Buffer.from(ascii, "ascii");
    const base64: string = buf.toString("base64");
    return base64;
  }
  throw new Error("unsupported environment");
}
