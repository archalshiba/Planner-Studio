// Simple replacement for class-variance-authority
export type VariantProps<T extends (...args: any) => any> = Omit<Parameters<T>[0], "class" | "className">

export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>
    defaultVariants?: Record<string, string>
  },
) {
  return (props?: Record<string, any>) => {
    if (!config?.variants) return base

    let classes = base
    const { variants, defaultVariants } = config

    // Apply default variants
    if (defaultVariants) {
      Object.entries(defaultVariants).forEach(([key, value]) => {
        if (variants[key]?.[value]) {
          classes += ` ${variants[key][value]}`
        }
      })
    }

    // Apply provided variants (override defaults)
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (value && variants[key]?.[value]) {
          // Remove default variant class if it exists
          if (defaultVariants?.[key] && variants[key][defaultVariants[key]]) {
            classes = classes.replace(variants[key][defaultVariants[key]], "")
          }
          classes += ` ${variants[key][value]}`
        }
      })
    }

    return classes.replace(/\s+/g, " ").trim()
  }
}
