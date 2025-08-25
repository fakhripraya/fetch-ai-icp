"use client"

import type React from "react"
import axios from "axios";
import { useState } from "react"
import { Menu, Home, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { config } from "@/lib/config";

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
  id:string;
  name: string;
  price: number;
  facility: string;
  location: string;
  images:string;
}

// Mock function to simulate backend response
const processImages = (kosanArray: IKosanDBObject[]): PropertyImage[] => {
  // link gambar 
  var randomImage = ['https://apollo.olx.co.id/v1/files/6796f09430a26-ID/image;s=780x0;q=60',
    'https://apollo.olx.co.id/v1/files/6892ada656da2-ID/image;s=780x0;q=60',
    'https://apollo.olx.co.id/v1/files/686f2dbc0e44d-ID/image;s=780x0;q=60',
    'https://apollo.olx.co.id/v1/files/686cff31f05c5-ID/image;s=780x0;q=60',
    'https://apollo.olx.co.id/v1/files/68a549775ae8b-ID/image;s=780x0;q=60']
  return kosanArray.map((kosan, index) => {
    return {
      id: kosan.id, // unique id
      url: kosan.images[0],
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
        "If you want to ask anything about boarding houses, rentals, or apartments, just use the textbox below. Right now the available info is only for Jabodetabek, but in the future we’ll expand to more cities. I also want to let you know that I might not always be 100% correct, so please double-check everything!",
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
      const response = await axios.post(`${config.agentApiUrl}/chat/submit`, {
        text: inputMessage,
      });

      const chatResponse: ChatApiResponse = response.data
      console.log(chatResponse)
      const images = chatResponse.resultArray ? processImages(chatResponse.resultArray) : []

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: chatResponse.result,
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
    <div className="flex h-screen w-full bg-[#0C0C0D] text-white relative">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarExpanded ? "w-64" : "w-0"
        } flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out bg-[#0C0C0D] overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 min-h-[73px] min-w-64">
          <button
            onClick={toggleSidebar}
            className="h-6 w-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 text-sm text-gray-400 min-w-64">No saved location yet</div>

        <div className="mt-auto p-4 text-xs text-gray-500 min-w-64">
          <p>© 2025 — Kringing Network. All Rights Reserved</p>
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
        </header>

        {/* Horizontal Border Line */}
        <div className="w-full h-px bg-[#333333]"></div>

        {/* Chat Messages */}
        <div className="flex-grow p-6 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 mb-6">
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center overflow-hidden">
                <img
                  src={message.sender === "bot" ? "/pintrail.png" : "/placeholder-user.jpg"}
                  alt={message.sender === "bot" ? "Pintrail Logo" : "User Avatar"}
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Message Content */}
              <div className="flex-grow">
                <div className="font-semibold">
                  {message.sender === "bot" ? "Pintrail" : "You"}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {formatTimestamp(message.timestamp)}
                </div>
                <div className="text-sm whitespace-pre-line mb-4">
                  {message.content}
                </div>

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
                          <h4 className="text-xs font-medium text-white truncate">
                            {image.title}
                          </h4>
                          <p className="text-xs text-green-400 font-semibold">
                            {image.price}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {image.description}
                          </p>
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
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center overflow-hidden">
                <img
                  src={"/pintrail.png"}
                  alt={"Pintrail Loading Logo"}
                  className="w-12 h-12 object-contain"
                />
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

