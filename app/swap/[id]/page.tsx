"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Coins,
  Star,
  TrendingUp,
  MapPin,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function SwapPage() {
  const params = useParams()
  const router = useRouter()
  const { items, user, createSwapRequest, isAuthenticated } = useApp()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const targetItem = items.find((item) => item.id === params.id)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  if (!targetItem) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/browse">Browse Items</Link>
        </Button>
      </div>
    )
  }

  const userItems = items.filter(
    (item) => item.uploaderId === user.id && item.status === "available" && item.id !== targetItem.id,
  )

  const selectedItemDetails = items.filter((item) => selectedItems.includes(item.id))
  const totalOfferedValue = selectedItemDetails.reduce((sum, item) => sum + item.pointsCost, 0)
  const pointsDifference = targetItem.pointsCost - totalOfferedValue
  const shippingCost = targetItem.uploaderLocation.city === user.location.city ? 0 : 50

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleNext = () => {
    if (currentStep === 1 && selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to offer in exchange.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    createSwapRequest(targetItem.id, selectedItems, message)

    toast({
      title: "Exchange request sent!",
      description: `Your exchange request has been sent to ${targetItem.uploaderName}.`,
    })

    setIsSubmitting(false)
    router.push("/swaps")
  }

  const progress = (currentStep / 4) * 100

  // Mock seller trust metrics
  const sellerTrustMetrics = {
    swapSuccessRate: 92,
    totalSwaps: 8,
    rating: 4.6,
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Exchange Request</h1>
          <p className="text-muted-foreground">Request to exchange items with {targetItem.uploaderName}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Step 1: Select Items */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Items to Offer</CardTitle>
            </CardHeader>
            <CardContent>
              {userItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No items available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have any available items to offer in exchange.
                  </p>
                  <Button asChild>
                    <Link href="/add-item">List an Item</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-colors ${
                        selectedItems.includes(item.id) ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleItemToggle(item.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemToggle(item.id)}
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
            </CardContent>
          </Card>

          {selectedItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Items Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items selected:</span>
                    <span className="font-medium">{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total value:</span>
                    <span className="font-medium">{totalOfferedValue} points</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={handleNext} disabled={selectedItems.length === 0}>
              Next: Review Exchange
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Review Exchange */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Exchange Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Item */}
              <div>
                <h3 className="font-semibold mb-3">You want:</h3>
                <div className="flex gap-4 p-4 border rounded-lg">
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
              </div>

              <Separator />

              {/* Offered Items */}
              <div>
                <h3 className="font-semibold mb-3">You're offering:</h3>
                <div className="space-y-3">
                  {selectedItemDetails.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
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
                  ))}
                </div>
              </div>

              <Separator />

              {/* Exchange Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Exchange Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>You're offering:</span>
                    <span className="font-medium">{totalOfferedValue} points value</span>
                  </div>
                  <div className="flex justify-between">
                    <span>You're requesting:</span>
                    <span className="font-medium">{targetItem.pointsCost} points value</span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping (intercity):</span>
                      <span className="font-medium">+{shippingCost} points</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Points difference:</span>
                    <span
                      className={`font-bold ${
                        pointsDifference > 0
                          ? "text-red-600"
                          : pointsDifference < 0
                            ? "text-green-600"
                            : "text-gray-600"
                      }`}
                    >
                      {pointsDifference > 0 ? `+${pointsDifference}` : pointsDifference < 0 ? pointsDifference : "0"}{" "}
                      points
                    </span>
                  </div>
                </div>

                {pointsDifference > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-700">
                        You may need to add {pointsDifference} points to complete this exchange
                      </p>
                    </div>
                  </div>
                )}

                {pointsDifference < 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-700">
                        You'll receive {Math.abs(pointsDifference)} points back from this exchange
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Next: Seller Info</Button>
          </div>
        </div>
      )}

      {/* Step 3: Seller Information */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seller Profile */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={targetItem.uploaderAvatar || "/placeholder.svg"} alt={targetItem.uploaderName} />
                  <AvatarFallback>{targetItem.uploaderName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{targetItem.uploaderName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    {targetItem.uploaderLocation.city}, {targetItem.uploaderLocation.state}
                  </div>
                </div>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{sellerTrustMetrics.swapSuccessRate}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold mb-1">{sellerTrustMetrics.totalSwaps}</div>
                  <div className="text-xs text-muted-foreground">Total Swaps</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{sellerTrustMetrics.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              {/* Location & Shipping */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Shipping Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span>
                      {targetItem.uploaderLocation.city}, {targetItem.uploaderLocation.state}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span>
                      {user.location.city}, {user.location.state}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className={shippingCost === 0 ? "text-green-600" : "text-orange-600"}>
                      {shippingCost === 0 ? "Free (Same city)" : `+${shippingCost} points (Intercity)`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Safety Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Shipping addresses will only be revealed after both parties accept the exchange</li>
                  <li>• Use the in-app chat to communicate with the seller</li>
                  <li>• Report any suspicious behavior to our support team</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Next: Add Message</Button>
          </div>
        </div>
      )}

      {/* Step 4: Message & Submit */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message to seller (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Hi! I'm interested in exchanging items with you. I think this would be a great swap..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  A friendly message can help build trust and increase your chances of a successful exchange.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Final Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Final Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Exchange Summary</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      Offering: {selectedItems.length} items ({totalOfferedValue} pts)
                    </div>
                    <div>
                      Requesting: {targetItem.title} ({targetItem.pointsCost} pts)
                    </div>
                    <div>Points difference: {pointsDifference} pts</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <div className="text-sm space-y-1">
                    <div>1. Request sent to seller</div>
                    <div>2. Seller reviews and responds</div>
                    <div>3. If accepted, exchange shipping details</div>
                    <div>4. Ship items and confirm delivery</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[150px]">
              {isSubmitting ? (
                "Sending Request..."
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Exchange Request
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
