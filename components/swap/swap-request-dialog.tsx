"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Coins, ArrowUpDown, Star, TrendingUp } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface SwapRequestDialogProps {
  targetItem: any
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
}

export function SwapRequestDialog({ targetItem, open, onOpenChange, trigger }: SwapRequestDialogProps) {
  const { user, items, createSwapRequest } = useApp()
  const { toast } = useToast()

  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [message, setMessage] = useState("")

  if (!user) return null

  const userItems = items.filter(
    (item) => item.uploaderId === user.id && item.status === "available" && item.id !== targetItem.id,
  )

  const selectedItemDetails = items.filter((item) => selectedItems.includes(item.id))
  const totalOfferedValue = selectedItemDetails.reduce((sum, item) => sum + item.pointsCost, 0)
  const pointsDifference = targetItem.pointsCost - totalOfferedValue

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to offer in exchange.",
        variant: "destructive",
      })
      return
    }

    createSwapRequest(targetItem.id, selectedItems, message)

    toast({
      title: "Swap request sent!",
      description: `Your exchange request has been sent to ${targetItem.uploaderName}.`,
    })

    setSelectedItems([])
    setMessage("")
    onOpenChange(false)
  }

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exchange Request</DialogTitle>
          <DialogDescription>
            Select items from your collection to offer in exchange for "{targetItem.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Item Preview */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">You want:</h3>
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-md overflow-hidden">
                  <Image
                    src={targetItem.images[0] || "/placeholder.svg"}
                    alt={targetItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{targetItem.title}</h4>
                  <p className="text-sm text-muted-foreground">Size: {targetItem.size}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Coins className="w-3 h-3 mr-1" />
                      {targetItem.pointsCost}
                    </Badge>
                    <Badge variant="outline">{targetItem.condition}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Trust Metrics */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Seller Trust Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">92%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold mb-1">8</div>
                  <div className="text-xs text-muted-foreground">Total Swaps</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold">4.6</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Items */}
          <div>
            <h3 className="font-semibold mb-3">Select items to offer:</h3>
            {userItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">You don't have any available items to offer.</p>
                  <Button variant="outline" className="mt-4 bg-transparent" asChild>
                    <a href="/add-item">List an Item</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-colors ${
                      selectedItems.includes(item.id) ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleItemToggle(item.id)}
                        />
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={item.images[0] || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              <Coins className="w-3 h-3 mr-1" />
                              {item.pointsCost}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.condition}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Exchange Summary */}
          {selectedItems.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Exchange Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>You're offering:</span>
                    <span className="font-medium">{totalOfferedValue} points value</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>You're requesting:</span>
                    <span className="font-medium">{targetItem.pointsCost} points value</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Points difference:</span>
                    <span
                      className={`font-bold ${pointsDifference > 0 ? "text-red-600" : pointsDifference < 0 ? "text-green-600" : "text-gray-600"}`}
                    >
                      {pointsDifference > 0 ? `+${pointsDifference}` : pointsDifference < 0 ? pointsDifference : "0"}{" "}
                      points
                    </span>
                  </div>
                  {pointsDifference > 0 && (
                    <p className="text-xs text-red-600">
                      You may need to add {pointsDifference} points to complete this exchange
                    </p>
                  )}
                  {pointsDifference < 0 && (
                    <p className="text-xs text-green-600">
                      You'll receive {Math.abs(pointsDifference)} points back from this exchange
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message to seller (optional)</Label>
            <Textarea
              id="message"
              placeholder="Hi! I'm interested in exchanging items with you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1" disabled={selectedItems.length === 0}>
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Send Exchange Request
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
