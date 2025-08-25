import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AddProductForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C0C0D] text-white p-6">
      <div className="w-full max-w-2xl bg-[#2a2a2a] rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Add New Product</h1>

        <form className="space-y-6">
          <div>
            <Label htmlFor="product-name" className="text-sm font-medium text-gray-300 mb-2 block">
              Product Name
            </Label>
            <Input
              id="product-name"
              type="text"
              placeholder="Enter product name"
              className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <Label htmlFor="product-price" className="text-sm font-medium text-gray-300 mb-2 block">
              Price
            </Label>
            <Input
              id="product-price"
              type="number"
              placeholder="Enter price"
              className="w-full bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <Label htmlFor="product-description" className="text-sm font-medium text-gray-300 mb-2 block">
              Description
            </Label>
            <Textarea
              id="product-description"
              placeholder="Enter product description"
              className="w-full min-h-[150px] bg-[#333333] border border-[#444444] text-white placeholder-gray-500 focus:ring-green-600 focus:border-green-600 resize-y"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg font-semibold"
          >
            Add Product
          </Button>
        </form>
      </div>
    </div>
  )
}
