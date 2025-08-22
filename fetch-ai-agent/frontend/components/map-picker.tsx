"use client"

import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet"
import { type LatLngExpression, Icon } from "leaflet"
import { useEffect, useState, useRef } from "react"

// Default marker icon (Leaflet's default icon)
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Custom icon for landmarks (e.g., a red pin)
const landmarkIcon = new Icon({
  iconUrl: "/placeholder.svg?height=25&width=41", // Placeholder for a red pin
  iconRetinaUrl: "/placeholder.svg?height=50&width=82",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface Landmark {
  id: string
  name: string
  latitude: number
  longitude: number
}

interface MapPickerProps {
  center: LatLngExpression
  zoom: number
  onLocationSelect: (lat: number, lng: number) => void
  landmarks: Landmark[] // New prop for landmarks
}

function LocationMarker({
  onLocationSelect,
  initialPosition,
}: {
  onLocationSelect: (lat: number, lng: number) => void
  initialPosition: LatLngExpression
}) {
  const [position, setPosition] = useState<LatLngExpression>(initialPosition)
  const markerRef = useRef(null)

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
    locationfound(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  useEffect(() => {
    // Update marker position if initialPosition prop changes
    setPosition(initialPosition)
  }, [initialPosition])

  return (
    <Marker
      position={position}
      icon={defaultIcon}
      draggable={true}
      eventHandlers={{
        dragend: (event) => {
          const marker = markerRef.current
          if (marker != null) {
            const latlng = event.target.getLatLng()
            setPosition(latlng)
            onLocationSelect(latlng.lat, latlng.lng)
          }
        },
      }}
      ref={markerRef}
    ></Marker>
  )
}

export default function MapPicker({ center, zoom, onLocationSelect, landmarks }: MapPickerProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="leaflet-container bg-[#333333] rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} initialPosition={center} />

      {/* Render Landmarks */}
      {landmarks.map((landmark) => (
        <Marker key={landmark.id} position={[landmark.latitude, landmark.longitude]} icon={landmarkIcon}>
          <Popup>{landmark.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
