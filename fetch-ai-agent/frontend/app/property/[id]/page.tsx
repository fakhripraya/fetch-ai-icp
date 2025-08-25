"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Phone, MessageCircle } from "lucide-react"
import axios from "axios";
import { config } from "@/lib/config"
import { formatToIDR } from "@/lib/utils"

interface PropertyDetails {
  id: string
  title: string
  price: string
  priceNumeric: number
  description: string
  fullDescription: string
  images: string[]
  location: {
    address: string
    district: string
    city: string
    latitude: number
    longitude: number
  }
  facilities: string[]
  specifications: {
    roomCount: number
    roomSize: string
    buildingType: string
    gender: string
    deposit: string
    minimumStay: string
  }
  contact: {
    phone: string
    whatsapp: string
    owner: string
  }
  nearbyPlaces: {
    name: string
    distance: string
    type: string
  }[]
  rules: string[]
  availability: {
    available: boolean
    availableRooms: number
    totalRooms: number
  }
}

// Mock function to fetch property details
const fetchPropertyDetails = async (id: string): Promise<PropertyDetails> => {
  // Simulate API delay
  const responseData = await axios.post(`${config.agentApiUrl}/kosan`, {
    idKosan: id,
    });

  console.log("isi res", responseData)
  const response = responseData.data.result

  // Mock data based on property ID
  const propertyDetails: PropertyDetails = {
    id: response.id,
    title: response.name,
    price: formatToIDR(response.price),
    priceNumeric: response.price,
    description: response.fullDescription.split(".")[0] + ".",
    fullDescription: response.fullDescription,
    images: response.images,
    location: {
      address: response.location,
      district: "",
      city: "",
      latitude: -6.2297,
      longitude: 106.7957,
    },
    facilities: response.facility
    ? response.facility
        .split(",")
        .map((f: string) => f.trim())
    : [],
    specifications: {
      roomCount: 15,
      roomSize: "4x5 meter",
      buildingType: "Boarding House",
      gender: "All Gender",
      deposit: formatToIDR(300000),
      minimumStay: "6 Months",
    },
    contact: {
      phone: "08123456789",
      whatsapp: "08123456789",
      owner: "Bagus",
    },
    nearbyPlaces: [
      { name: "Stasiun MRT Blok M", distance: "500m", type: "transport" },
      { name: "Blok M Plaza", distance: "600m", type: "shop" },
      { name: "McDonald's", distance: "400m", type: "food" },
      { name: "Bank Mandiri", distance: "300m", type: "bank" },
      { name: "RS Fatmawati", distance: "1.2km", type: "health" },
    ],
    rules: [
      "All Gender",
      "Night hour max 23.00 PM",
      "Guest hour max 22.00 PM",
      "No smoking inside the room",
      "Keep the cleanliness",
      "No alcohol",
    ],
    availability: {
      available: true,
      availableRooms: 4,
      totalRooms: 15,
    },
  }

  return propertyDetails
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const propertyData = await fetchPropertyDetails(params.id as string)
        setProperty(propertyData)
      } catch (error) {
        console.error("Error loading property:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [params.id])

  const handleContactWhatsApp = () => {
    if (property?.contact.whatsapp) {
      const message = `Halo, saya tertarik dengan ${property.title}. Bisakah saya mendapatkan informasi lebih lanjut?`
      const whatsappUrl = `https://wa.me/${property.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  const handleContactPhone = () => {
    if (property?.contact.phone) {
      window.location.href = `tel:${property.contact.phone}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0C0C0D] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Property not found</p>
          <Button onClick={() => router.back()} className="bg-green-600 hover:bg-green-700">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0C0C0D] border-b border-[#333333] p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button onClick={() => router.back()} variant="ghost" className="text-white hover:bg-[#333333] p-2">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Chat
          </Button>
          <h1 className="text-lg font-semibold">Property Details</h1>
          <div></div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="mb-4">
            <img
              src={property.images[selectedImageIndex] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImageIndex === index ? "border-green-600" : "border-[#333333]"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-400 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {property.location.address}, {property.location.district}, {property.location.city}
              </div>
              <div className="text-3xl font-bold text-green-400 mb-4">{property.price}/month</div>
              <p className="text-gray-300 leading-relaxed">{property.fullDescription}</p>
            </div>

            {/* Specifications */}
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Room Size:</span>
                  <span className="ml-2">{property.specifications.roomSize}</span>
                </div>
                <div>
                  <span className="text-gray-400">Building Type:</span>
                  <span className="ml-2">{property.specifications.buildingType}</span>
                </div>
                <div>
                  <span className="text-gray-400">Gender:</span>
                  <span className="ml-2">{property.specifications.gender}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Rooms:</span>
                  <span className="ml-2">{property.specifications.roomCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Deposit:</span>
                  <span className="ml-2">{property.specifications.deposit}</span>
                </div>
                <div>
                  <span className="text-gray-400">Minimum Stay:</span>
                  <span className="ml-2">{property.specifications.minimumStay}</span>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {property.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-600 text-white">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Nearby Places</h2>
              <div className="space-y-3">
                {property.nearbyPlaces.map((place, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{place.name}</span>
                      <span className="text-gray-400 ml-2">({place.type})</span>
                    </div>
                    <span className="text-green-400">{place.distance}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">House Rules</h2>
              <ul className="space-y-2">
                {property.rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className={property.availability.available ? "bg-green-600" : "bg-red-600"}>
                    {property.availability.available ? "Available" : "Full"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Available Rooms:</span>
                  <span className="text-green-400">
                    {property.availability.availableRooms}/{property.availability.totalRooms}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Owner:</span>
                  <span className="ml-2">{property.contact.owner}</span>
                </div>
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <span className="ml-2">{property.contact.phone}</span>
                </div>
                <div className="space-y-2 pt-4">
                  <Button onClick={handleContactWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact via WhatsApp
                  </Button>
                  <Button
                    onClick={handleContactPhone}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-600 bg-transparent"
                >
                  Save to Favorites
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-600 bg-transparent"
                >
                  Share Property
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-600 bg-transparent"
                >
                  Report Issue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
