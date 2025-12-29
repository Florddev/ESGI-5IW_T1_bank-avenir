export function toViewModels<TDto, TViewModel>(
  dtos: TDto[],
  transformFn: (dto: TDto) => TViewModel
): TViewModel[] {
  return dtos.map(transformFn);
}

export function getLabel(
  value: string,
  labels: Record<string, string>,
  defaultValue?: string
): string {
  return labels[value] || defaultValue || value;
}

export function getColor<TColor extends string>(
  value: string,
  colors: Record<string, TColor>,
  defaultColor: TColor
): TColor {
  return colors[value] || defaultColor;
}
