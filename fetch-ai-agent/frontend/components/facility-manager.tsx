"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface FacilityManagerProps {
  facilities: string[]
  setFacilities: (facilities: string[]) => void
}

export default function FacilityManager({ facilities, setFacilities }: FacilityManagerProps) {
  const [newFacility, setNewFacility] = useState("")

  // Predefined common facilities
  const commonFacilities = [
    "AC",
    "WiFi",
    "Private Bathroom",
    "Furnished",
    "Shared Kitchen",
    "Laundry Service",
    "24/7 Security",
    "Parking",
    "CCTV",
    "Water Heater",
    "Refrigerator",
    "Wardrobe",
    "Study Desk",
    "Chair",
    "Bed",
    "Pillow & Blanket",
    "Cleaning Service",
    "Electricity Included",
    "Water Included",
    "Near Public Transport",
    "Near Mall",
    "Near University",
    "Near Hospital",
    "Gym Access",
    "Swimming Pool",
    "Rooftop Access",
    "Balcony",
    "Garden View",
    "City View",
  ]

  const handleCommonFacilityToggle = (facility: string) => {
    if (facilities.includes(facility)) {
      setFacilities(facilities.filter((f) => f !== facility))
    } else {
      setFacilities([...facilities, facility])
    }
  }

  const handleAddCustomFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities([...facilities, newFacility.trim()])
      setNewFacility("")
    }
  }

  const handleRemoveFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCustomFacility()
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-300 mb-2 block">Facilities</Label>

      {/* Common Facilities */}
      <div>
        <Label className="text-xs text-gray-400 mb-2 block">Common Facilities</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto bg-[#333333] p-3 rounded-md border border-[#444444]">
          {commonFacilities.map((facility) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                id={`facility-${facility}`}
                checked={facilities.includes(facility)}
                onCheckedChange={() => handleCommonFacilityToggle(facility)}
                className="border-[#444444] data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
              />
              <Label htmlFor={`facility-${facility}`} className="text-gray-300 text-xs cursor-pointer">
                {facility}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Facility */}
      <div>
        <Label className="text-xs text-gray-400 mb-2 block">Add Custom Facility</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., Rooftop Garden, Pet Friendly, etc."
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
          />
          <Button
            type="button"
            onClick={handleAddCustomFacility}
            disabled={!newFacility.trim() || facilities.includes(newFacility.trim())}
            className="bg-green-600 hover:bg-green-700 px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selected Facilities */}
      {facilities.length > 0 && (
        <div>
          <Label className="text-xs text-gray-400 mb-2 block">Selected Facilities ({facilities.length})</Label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto bg-[#333333] p-3 rounded-md border border-[#444444]">
            {facilities.map((facility) => (
              <Badge
                key={facility}
                variant="secondary"
                className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
              >
                {facility}
                <button
                  type="button"
                  onClick={() => handleRemoveFacility(facility)}
                  className="ml-1 hover:bg-green-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
