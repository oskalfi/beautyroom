export const generateRoundedRectPath = (
  width: number,
  height: number,
  radius: number,
) => {
  return `
    M ${width / 2} 0 
    L ${width - radius} 0
    A ${radius} ${radius} 0 0 1 ${width} ${radius}
    L ${width} ${height - radius}
    A ${radius} ${radius} 0 0 1 ${width - radius} ${height}
    L ${radius} ${height}
    A ${radius} ${radius} 0 0 1 0 ${height - radius}
    L 0 ${radius}
    A ${radius} ${radius} 0 0 1 ${radius} 0
    Z
  `.trim();
};
