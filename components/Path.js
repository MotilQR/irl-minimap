/**
 * Нормализует путь по массиву GPS-точек
 * @param {number[][]} coords - Двумерный массив координат [latitude, longitude]
 * @param {number} resultCount - Сколько точек нужно получить на выходе (по умолчанию 20)
 * @returns {number[][]} Нормализованный массив координат
 */
export default function normalizePath(coords, resultCount = 20) {
    if (coords.length < 2) {
      throw new Error("Необходимо как минимум 2 точки.");
    }
  
    // Считаем центр масс
    const mean = coords.reduce(
      (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
      [0, 0]
    ).map(val => val / coords.length);
  
    // Центрируем координаты
    const centered = coords.map(([lat, lng]) => [lat - mean[0], lng - mean[1]]);
  
    // Выполняем PCA вручную (всего 2D — можно просто)
    let Sxx = 0, Sxy = 0, Syy = 0;
    for (const [x, y] of centered) {
      Sxx += x * x;
      Sxy += x * y;
      Syy += y * y;
    }
  
    const covXX = Sxx / coords.length;
    const covXY = Sxy / coords.length;
    const covYY = Syy / coords.length;
  
    const angle = 0.5 * Math.atan2(2 * covXY, covXX - covYY);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
  
    // Проецируем точки на первую компоненту
    const projections = centered.map(([x, y]) => x * cosA + y * sinA);
  
    // Сортируем точки по проекции
    const sorted = projections
      .map((proj, i) => ({ proj, original: coords[i] }))
      .sort((a, b) => a.proj - b.proj);
  
    // Удаляем выбросы (отсекаем 10% с каждого края)
    const trim = Math.floor(sorted.length * 0.1);
    const trimmed = sorted.slice(trim, sorted.length - trim);
  
    // Минимальная и максимальная проекции
    const minP = trimmed[0].proj;
    const maxP = trimmed[trimmed.length - 1].proj;
  
    // Генерируем равномерные точки вдоль линии
    const step = (maxP - minP) / (resultCount - 1);
    const result = [];
  
    for (let i = 0; i < resultCount; i++) {
      const proj = minP + step * i;
      // Восстановим координаты из проекции
      const x = proj * cosA;
      const y = proj * sinA;
      result.push([x + mean[0], y + mean[1]]);
    }
  
    return result;
  }
  