// Haversine distance calculator between two latitude/longitude points

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 100) / 100;
}

export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Find nearest driver to a complaint location
export function findNearestVehicle(complaintLat, complaintLng, vehicles) {
  if (!vehicles || vehicles.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  vehicles.forEach((vehicle) => {
    const dist = calculateDistanceKm(
      complaintLat,
      complaintLng,
      vehicle.currentLat,
      vehicle.currentLng
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = {
        ...vehicle,
        distanceKm: dist,
        distanceText: formatDistance(dist),
        estimatedMinutes: Math.max(3, Math.round(dist * 3.2)) // Approx urban drive time
      };
    }
  });

  return nearest;
}
