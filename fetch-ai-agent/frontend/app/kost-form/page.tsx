"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import MultiUpload from "@/components/multi-upload"
import LocationPicker from "@/components/location-picker"
import FacilityManager from "@/components/facility-manager"
import { Loader2 } from "lucide-react"

// Interfaces for MultiUpload component (copied from multi-upload.tsx for clarity)
interface FileWithMeta {
  name: string
  type: string
  size: number
  blob?: Blob
  base64?: string
  url?: string
}

interface RejectedFile {
  file: FileWithMeta
  errors: readonly { code: string; message: string }[]
}

// Interface matching your backend's expected format
interface LocationData {
  address: string
  latitude?: number
  longitude?: number
  city: string
  district: string
  subDistrict: string
  postalCode: string
}

interface FormPayload {
  kostName: string
  location: LocationData
  price: number | ""
  numRooms: number | ""
  description: string
  facilities: string[]
  images: {
    name: string
    size: number
    type: string
    url: string
  }[]
}

export default function KostFormPage() {
  const [kostName, setKostName] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [numRooms, setNumRooms] = useState<number | "">("")
  const [description, setDescription] = useState("")
  const [facilities, setFacilities] = useState<string[]>([])
  const [location, setLocation] = useState<LocationData>({
    address: "",
    latitude: undefined,
    longitude: undefined,
    city: "",
    district: "",
    subDistrict: "",
    postalCode: "",
  })

  const [files, setFiles] = useState<FileWithMeta[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Helper function to convert FileWithMeta to the expected image format
  const convertFilesToImageObjects = (files: FileWithMeta[]) => {
    return files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.url || file.base64 || (file.blob ? URL.createObjectURL(file.blob) : ""),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Create the payload matching your backend's expected format
      const formData: FormPayload = {
        kostName,
        location,
        price,
        numRooms,
        description,
        facilities,
        images: convertFilesToImageObjects(files),
      }

      // Log the payload for debugging
      console.log("Payload being sent:", formData)

      // Make the axios POST request with JSON data
      const response = await axios.post("http://dummy.com", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      })

      console.log("Response:", response.data)
      setSubmitMessage({
        type: "success",
        text: "Kost data submitted successfully!",
      })

      // Reset form after successful submission (optional)
      // resetForm()
    } catch (error) {
      console.error("Submission error:", error)

      let errorMessage = "Failed to submit kost data. Please try again."

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage = "Request timeout. Please check your connection and try again."
        } else if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`
          // If the server returns a specific error message, use it
          if (error.response.data?.message) {
            errorMessage += ` - ${error.response.data.message}`
          }
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection."
        }
      }

      setSubmitMessage({
        type: "error",
        text: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Optional: Function to reset form
  const resetForm = () => {
    setKostName("")
    setPrice("")
    setNumRooms("")
    setDescription("")
    setFacilities([])
    setLocation({
      address: "",
      latitude: undefined,
      longitude: undefined,
      city: "",
      district: "",
      subDistrict: "",
      postalCode: "",
    })
    setFiles([])
    setRejectedFiles([])
    setSubmitMessage(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="w-full max-w-3xl bg-[#2a2a2a] rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Add New Kost</h1>

        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`mb-6 p-4 rounded-md ${
              submitMessage.type === "success"
                ? "bg-green-600/20 border border-green-600 text-green-300"
                : "bg-red-600/20 border border-red-600 text-red-300"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="kost-name" className="text-sm font-medium text-gray-300 mb-2 block">
              Kost Name
            </Label>
            <Input
              id="kost-name"
              type="text"
              placeholder="e.g., Kost Bahagia"
              value={kostName}
              onChange={(e) => setKostName(e.target.value)}
              className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Location Picker */}
          <LocationPicker location={location} setLocation={setLocation} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-300 mb-2 block">
                Price (per month, IDR)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 1500000"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="num-rooms" className="text-sm font-medium text-gray-300 mb-2 block">
                Number of Rooms
              </Label>
              <Input
                id="num-rooms"
                type="number"
                placeholder="e.g., 10"
                value={numRooms}
                onChange={(e) => setNumRooms(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-300 mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the kost, including amenities, rules, and nearby facilities."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[150px] bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600 resize-y"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Facility Manager */}
          <FacilityManager facilities={facilities} setFacilities={setFacilities} />

          <div>
            <Label className="text-sm font-medium text-gray-300 mb-2 block">Upload Images</Label>
            <MultiUpload
              files={files}
              setFiles={setFiles}
              rejected={rejectedFiles}
              setRejected={setRejectedFiles}
              extensions={["image/jpeg", "image/png", "image/gif"]} // Allowed image types
              maxSize={5 * 1024 * 1024} // 5 MB
              maxLength={5} // Max 5 files
              label="Drag 'n' drop some files here, or click to select files"
              subLabel="Only .jpeg, .png, .gif images up to 5MB and 5 files max"
              formName="kost-images"
              uniqueKey="kost-upload"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-md text-lg font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Add Kost"
              )}
            </Button>

            {submitMessage?.type === "success" && (
              <Button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md text-lg font-semibold"
              >
                Reset Form
              </Button>
            )}
          </div>
        </form>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-[#333333] rounded-md">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Debug Info (Development Only)</h3>
            <pre className="text-xs text-gray-400 overflow-auto">
              {JSON.stringify(
                {
                  kostName,
                  location,
                  price,
                  numRooms,
                  description,
                  facilities,
                  images: convertFilesToImageObjects(files),
                },
                null,
                2,
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
