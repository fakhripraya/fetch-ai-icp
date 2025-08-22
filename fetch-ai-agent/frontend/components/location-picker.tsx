"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Globe } from "lucide-react"
import MapPicker from "./map-picker" // Import the new MapPicker component
import { generateDummyLandmarks, getDistanceFromLatLonInKm } from "@/utils/global-functions"

interface LocationData {
  address: string
  latitude?: number
  longitude?: number
  city: string
  district: string
  subDistrict: string
  postalCode: string
}

interface Landmark {
  id: string
  name: string
  latitude: number
  longitude: number
}

interface LocationPickerProps {
  location: LocationData
  setLocation: (location: LocationData) => void
}

// Mock reverse geocoding function
const mockReverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  if (lat > -7 && lat < -6 && lng > 106 && lng < 107) {
    return {
      address: `Jl. Mocked Street, Near Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`,
      city: "Jakarta",
      district: "Central Jakarta",
      subDistrict: "Tanah Abang",
      postalCode: "10250",
    }
  }
  return {
    address: `Unknown Location, Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
    city: "Unknown City",
    district: "Unknown District",
    subDistrict: "Unknown Sub-District",
    postalCode: "",
  }
}

export default function LocationPicker({ location, setLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showMap, setShowMap] = useState(false)
  const [landmarks, setLandmarks] = useState<Landmark[]>([]) // State for landmarks

  // Default map center (Jakarta, Indonesia)
  const defaultMapCenter: [number, number] = [-6.2088, 106.8456]
  const defaultMapZoom = 13
  const landmarkRadiusKm = 5 // 5km radius for landmarks

  // Mock location suggestions
  const mockSuggestions = [
    "Jl. Sudirman, Jakarta Pusat, DKI Jakarta",
    "Jl. Thamrin, Jakarta Pusat, DKI Jakarta",
    "Jl. Kebon Jeruk, Jakarta Barat, DKI Jakarta",
    "Jl. Margonda Raya, Depok, Jawa Barat",
    "Jl. Raya Bogor, Bogor, Jawa Barat",
    "Jl. Malioboro, Yogyakarta, DIY",
    "Jl. Dago, Bandung, Jawa Barat",
    "Jl. Pemuda, Semarang, Jawa Tengah",
  ]

  // Function to fetch and filter landmarks
  const fetchAndFilterLandmarks = async (centerLat: number, centerLng: number) => {
    const allDummyLandmarks = generateDummyLandmarks(centerLat, centerLng) // Generate around the current center
    const filteredLandmarks = allDummyLandmarks.filter((lm) => {
      const distance = getDistanceFromLatLonInKm(centerLat, centerLng, lm.latitude, lm.longitude)
      return distance <= landmarkRadiusKm
    })
    setLandmarks(filteredLandmarks)
  }

  useEffect(() => {
    // When component mounts or location changes, fetch landmarks if map is shown
    if (showMap && location.latitude && location.longitude) {
      fetchAndFilterLandmarks(location.latitude, location.longitude)
    } else if (!showMap) {
      setLandmarks([]) // Clear landmarks if not on map view
    }
  }, [showMap, location.latitude, location.longitude])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setTimeout(() => {
      const filtered = mockSuggestions.filter((addr) => addr.toLowerCase().includes(searchQuery.toLowerCase()))
      setSuggestions(filtered)
      setIsSearching(false)
    }, 500)
  }

  const selectSuggestion = (suggestion: string) => {
    const parts = suggestion.split(", ")
    setLocation({
      ...location,
      address: suggestion,
      city: parts[1] || "",
      district: parts[1] || "",
      subDistrict: parts[0]?.split(". ")[1] || "",
      // Lat/Lng would come from a real API here
    })
    setSuggestions([])
    setSearchQuery("")
  }

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }))
    const geocoded = await mockReverseGeocode(lat, lng)
    setLocation((prev) => ({
      ...prev,
      address: geocoded.address || prev.address,
      city: geocoded.city || prev.city,
      district: geocoded.district || prev.district,
      subDistrict: geocoded.subDistrict || prev.subDistrict,
      postalCode: geocoded.postalCode || prev.postalCode,
    }))
    // Fetch landmarks based on the newly selected map location
    fetchAndFilterLandmarks(lat, lng)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handleMapLocationSelect(latitude, longitude) // Use map select handler to update all fields
          setShowMap(true) // Show map with current location
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enter manually or try map picker.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-300 mb-2 block">Location Details</Label>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => setShowMap(false)}
          className={`flex-1 ${!showMap ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"} text-white`}
        >
          <Search className="h-4 w-4 mr-2" /> Manual/Search
        </Button>
        <Button
          type="button"
          onClick={() => setShowMap(true)}
          className={`flex-1 ${showMap ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"} text-white`}
        >
          <Globe className="h-4 w-4 mr-2" /> Pick on Map
        </Button>
      </div>

      {!showMap ? (
        /* Manual Input / Search View */
        <div className="space-y-4">
          {/* Address Search */}
          <div className="space-y-2">
            <Label htmlFor="address-search" className="text-xs text-gray-400">
              Search Address
            </Label>
            <div className="flex gap-2">
              <Input
                id="address-search"
                type="text"
                placeholder="Search for address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-green-600 hover:bg-green-700 px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button type="button" onClick={getCurrentLocation} className="bg-blue-600 hover:bg-blue-700 px-3">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-[#333333] border border-[#444444] rounded-md max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-[#444444] text-white text-sm border-b border-[#444444] last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual Address Input */}
          <div>
            <Label htmlFor="full-address" className="text-xs text-gray-400">
              Full Address
            </Label>
            <Input
              id="full-address"
              type="text"
              placeholder="e.g., Jl. Kebon Jeruk No. 10, RT 01/RW 02"
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
              required
            />
          </div>

          {/* Location Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-xs text-gray-400">
                City
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., Jakarta"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>
            <div>
              <Label htmlFor="district" className="text-xs text-gray-400">
                District
              </Label>
              <Input
                id="district"
                type="text"
                placeholder="e.g., Jakarta Barat"
                value={location.district}
                onChange={(e) => setLocation({ ...location, district: e.target.value })}
                className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>
            <div>
              <Label htmlFor="sub-district" className="text-xs text-gray-400">
                Sub District
              </Label>
              <Input
                id="sub-district"
                type="text"
                placeholder="e.g., Kebon Jeruk"
                value={location.subDistrict}
                onChange={(e) => setLocation({ ...location, subDistrict: e.target.value })}
                className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>
            <div>
              <Label htmlFor="postal-code" className="text-xs text-gray-400">
                Postal Code
              </Label>
              <Input
                id="postal-code"
                type="text"
                placeholder="e.g., 11530"
                value={location.postalCode}
                onChange={(e) => setLocation({ ...location, postalCode: e.target.value })}
                className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>
          </div>
        </div>
      ) : (
        /* Map Picker View */
        <div className="space-y-4">
          <MapPicker
            center={
              location.latitude && location.longitude ? [location.latitude, location.longitude] : defaultMapCenter
            }
            zoom={defaultMapZoom}
            onLocationSelect={handleMapLocationSelect}
            landmarks={landmarks} // Pass landmarks to MapPicker
          />
          <div className="text-xs text-gray-400 bg-[#333333] p-2 rounded">
            Selected Coordinates: {location.latitude?.toFixed(6) || "N/A"}, {location.longitude?.toFixed(6) || "N/A"}
            <br />
            Address (from map): {location.address || "N/A"}
            <br />
            Landmarks found within {landmarkRadiusKm}km: {landmarks.length}
          </div>
        </div>
      )}

      {/* Coordinates Display (always visible for debugging/info) */}
      {location.latitude && location.longitude && (
        <div className="text-xs text-gray-400 bg-[#333333] p-2 rounded">
          Current Lat/Lng: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </div>
      )}
    </div>
  )
}
