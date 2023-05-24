export const choice = ([head, ...strings]: TemplateStringsArray, ...values: any[]): {
  type: "choice",
  options: string[]
} => ({
  type: "choice",
  options: (head + strings.map((s, i) => s + values[i]).join("")).split("|")
});
