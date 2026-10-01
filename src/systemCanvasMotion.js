export function getPointerInfluence(point, pointer, radius = 180, strength = 18) {
  if (!pointer || radius <= 0) {
    return { offsetX: 0, offsetY: 0, intensity: 0 };
  }

  const deltaX = point.x - pointer.x;
  const deltaY = point.y - pointer.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= radius) {
    return { offsetX: 0, offsetY: 0, intensity: 0 };
  }

  const intensity = (1 - distance / radius) ** 2;
  const directionX = distance > 0 ? deltaX / distance : 0;
  const directionY = distance > 0 ? deltaY / distance : 0;

  return {
    offsetX: directionX * strength * intensity,
    offsetY: directionY * strength * intensity,
    intensity,
  };
}
