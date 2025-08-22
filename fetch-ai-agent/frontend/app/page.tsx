"use client"

import type React from "react"
import axios from "axios";
import { useState } from "react"
import { Menu, RefreshCw, Home, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface PropertyImage {
  id: string
  url: string
  title: string
  price: string
  description: string
}

interface ChatMessage {
  id: string
  sender: "user" | "bot"
  content: string
  timestamp: Date
  images?: PropertyImage[]
}

interface ChatApiResponse {
  timestamp: number;
  result: string;
  resultArray: IKosanDBObject[];  // adjust type if it can contain more than strings
  agent_address: string;
}

export interface IKosanDBObject {
  name: string;
  price: number;
  facility: string;
  location: string;
}

// Mock function to simulate backend response
const processImages = (kosanArray: IKosanDBObject[]): PropertyImage[] => {
  return kosanArray.map((kosan, index) => {
    return {
      id: `${Date.now()}-${index}`, // unique id
      url: `/images/${kosan.name.replace(/\s+/g, "-").toLowerCase()}.jpg`,
      title: kosan.name,
      price: `Rp ${kosan.price.toLocaleString("id-ID")}`, // formatted price
      description: `${kosan.facility} - ${kosan.location}`,
    };
  });
};

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      content:
        "Hai bro,\n\nKalau kamu mau nanya - nanya seputar Kostan, Kontrakan, dan apartment tinggal tanya aja ya pakai textbox dibawah ini. Saat ini info yang tersedia hanya bertempat di Jakarta, tapi kedepannya kita bakal perbanyak lokasi di kota - kota lain. Aku juga mau kasih tau kalau aku belum tentu benar dan masih bisa salah jadi double check semuanya ya !",
      timestamp: new Date("2025-07-19T15:15:08"),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [trailTokenBalance, setTrailTokenBalance] = useState(1250) // Mock balance

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response: ChatApiResponse = await axios.post("http://localhost:8001/chat/submit", {
        text: inputMessage,
      });
      const images = processImages(response.resultArray)

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: response.result,
        timestamp: new Date(),
        images: images,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/property/${propertyId}`)
  }

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  const formatTimestamp = (date: Date) => {
    return (
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      })
    )
  }

  return (
    <div className="flex h-screen w-full bg-[#1a1a1a] text-white relative">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarExpanded ? "w-64" : "w-0"
        } flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out bg-[#1a1a1a] overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 min-h-[73px] min-w-64">
          <button
            onClick={toggleSidebar}
            className="h-6 w-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
          <RefreshCw className="h-6 w-6 text-gray-400 flex-shrink-0" />
        </div>

        <div className="p-4 text-sm text-gray-400 min-w-64">Belum ada lokasi tersimpan</div>

        <div className="mt-auto p-4 text-xs text-gray-500 min-w-64">
          <p className="mb-1">
            <a href="#" className="text-green-500 hover:underline">
              Privacy
            </a>{" "}
            •{" "}
            <a href="#" className="text-green-500 hover:underline">
              Terms
            </a>{" "}
            •{" "}
            <a href="#" className="text-green-500 hover:underline">
              Feedback
            </a>
          </p>
          <p>© 2025 — Yuugen Lab. All Rights Reserved</p>
        </div>
      </aside>

      {/* Vertical Border Line */}
      <div
        className={`${
          sidebarExpanded ? "opacity-100" : "opacity-0"
        } absolute top-0 w-px h-full bg-[#333333] transition-all duration-300 ease-in-out z-10`}
        style={{ left: sidebarExpanded ? "256px" : "0px" }}
      ></div>

      {/* Main Content Area */}
      <main className="flex flex-col flex-grow transition-all duration-300 ease-in-out">
        {/* Header */}
        <header className="flex items-center justify-between p-4 min-h-[73px]">
          <div className="flex items-center space-x-4">
            {!sidebarExpanded && (
              <button
                onClick={toggleSidebar}
                className="h-6 w-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <h1 className="text-lg font-semibold">Pintrail</h1>
          </div>

          {/* TrailToken Balance */}
          <div className="flex items-center space-x-2 bg-[#2a2a2a] px-3 py-2 rounded-lg border border-[#333333]">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">TrailToken:</span>
            <span className="text-sm font-semibold text-green-400">{trailTokenBalance.toLocaleString()}</span>
          </div>
        </header>

        {/* Horizontal Border Line */}
        <div className="w-full h-px bg-[#333333]"></div>

        {/* Chat Messages */}
        <div className="flex-grow p-6 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center">
                <Home className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-grow">
                <div className="font-semibold">{message.sender === "bot" ? "Pintrail" : "You"}</div>
                <div className="text-xs text-gray-400 mb-2">{formatTimestamp(message.timestamp)}</div>
                <div className="text-sm whitespace-pre-line mb-4">{message.content}</div>

                {/* Property Images Grid */}
                {message.images && message.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                    {message.images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => handlePropertyClick(image.id)}
                        className="bg-[#333333] rounded-lg overflow-hidden cursor-pointer hover:bg-[#444444] transition-colors"
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <h4 className="text-xs font-medium text-white truncate">{image.title}</h4>
                          <p className="text-xs text-green-400 font-semibold">{image.price}</p>
                          <p className="text-xs text-gray-400 truncate">{image.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center">
                <Home className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <div className="font-semibold">Pintrail</div>
                <div className="text-xs text-gray-400 mb-2">Typing...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-[#333333] flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-grow p-3 rounded-md bg-[#333333] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-600 border-[#444444]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
