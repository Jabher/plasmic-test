export const choice = ([head, ...strings]: TemplateStringsArray, ...values: any[]): {
  type: "choice",
  options: string[]
} => ({
  type: "choice",
  options: (head + strings.map((s, i) => s + values[i]).join("")).split("|")
} as const);

export const range = (from: number, to: number, step = 1) => ({
  type: "number",
  min: from,
  max: to,
  step: step
} as const)
