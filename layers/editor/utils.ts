export function isTextType(type: string | undefined) {
  return type === 'text' || type === 'i-text' || type === 'textbox'
}

export interface RGBColor {
  a?: number | undefined
  b: number
  g: number
  r: number
}

export function rgbaObjectToString(rgba: RGBColor | 'transparent') {
  if (rgba === 'transparent') {
    return `rgba(0,0,0,0)`
  }

  const alpha = rgba.a === undefined ? 1 : rgba.a

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`
};
