// Utility function to format numbers (e.g., file sizes)
export const formattedNumber = (num: number): string => {
  return num.toLocaleString("en-US")
}

// Utility function to check if a file type is an image
export const isImageType = (type: string): boolean => {
  return type.startsWith("image/")
}

// Haversine formula to calculate distance between two lat/lon points in km
export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radius of Earth in kilometers
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Dummy Landmark Data Generation
interface Landmark {
  id: string
  name: string
  latitude: number
  longitude: number
}

export const generateDummyLandmarks = (centerLat: number, centerLng: number): Landmark[] => {
  const landmarks: Landmark[] = []
  const baseLat = centerLat || -6.2088 // Default to Jakarta if no center provided
  const baseLng = centerLng || 106.8456

  for (let i = 0; i < 10; i++) {
    // Generate random offsets within a small range (e.g., 0.05 degrees ~ 5.5km)
    const latOffset = (Math.random() - 0.5) * 0.1 // -0.05 to +0.05
    const lngOffset = (Math.random() - 0.5) * 0.1 // -0.05 to +0.05

    landmarks.push({
      id: `landmark-${i + 1}`,
      name: `Landmark ${i + 1}`,
      latitude: baseLat + latOffset,
      longitude: baseLng + lngOffset,
    })
  }
  return landmarks
}
