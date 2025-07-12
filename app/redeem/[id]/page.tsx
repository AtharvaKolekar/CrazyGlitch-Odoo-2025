"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Coins,
  MapPin,
  Truck,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Package,
  Shield,
  Clock,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function RedeemPage() {
  const params = useParams()
  const router = useRouter()
  const { items, user, createRedeemRequest, isAuthenticated } = useApp()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.username || "",
    address: "",
    city: user?.location.city || "",
    state: user?.location.state || "",
    pincode: "",
    phone: "",
  })
  const [specialInstructions, setSpecialInstructions] = useState("")
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

  const shippingCost = targetItem.uploaderLocation.city === user.location.city ? 0 : 50
  const totalCost = targetItem.pointsCost + shippingCost
  const canAfford = user.points >= totalCost

  const handleNext = () => {
    if (currentStep === 2) {
      // Validate shipping address
      const requiredFields = ["fullName", "address", "city", "state", "pincode", "phone"]
      const missingFields = requiredFields.filter((field) => !shippingAddress[field as keyof typeof shippingAddress])

      if (missingFields.length > 0) {
        toast({
          title: "Missing information",
          description: "Please fill in all required shipping details.",
          variant: "destructive",
        })
        return
      }
    }
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!canAfford) {
      toast({
        title: "Insufficient points",
        description: `You need ${totalCost} points but only have ${user.points}.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    createRedeemRequest(targetItem.id)

    toast({
      title: "Redemption successful!",
      description: `You've successfully redeemed "${targetItem.title}" for ${totalCost} points.`,
    })

    setIsSubmitting(false)
    router.push("/dashboard")
  }

  const progress = (currentStep / 3) * 100

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Redeem with Points</h1>
          <p className="text-muted-foreground">Use your swap points to claim this item directly</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of 3</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Step 1: Review Item & Cost */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={targetItem.images[0] || "/placeholder.svg"}
                    alt={targetItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{targetItem.title}</h3>
                    <p className="text-muted-foreground mt-1">{targetItem.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <p className="font-medium">{targetItem.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Size</Label>
                      <p className="font-medium">{targetItem.size}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Condition</Label>
                      <p className="font-medium">{targetItem.condition}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Brand</Label>
                      <p className="font-medium">{targetItem.specifications.brand || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {targetItem.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Item cost:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Coins className="w-3 h-3 mr-1" />
                    {targetItem.pointsCost}
                  </Badge>
                </div>

                {shippingCost > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                      <span>Shipping (intercity):</span>
                    </div>
                    <Badge variant="outline">
                      <Coins className="w-3 h-3 mr-1" />+{shippingCost}
                    </Badge>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total cost:</span>
                  <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                    <Coins className="w-4 h-4 mr-1" />
                    {totalCost}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>Your balance:</span>
                  <span className={`font-medium ${canAfford ? "text-green-600" : "text-red-600"}`}>
                    <Coins className="w-4 h-4 inline mr-1" />
                    {user.points}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span>After redemption:</span>
                  <span className={`font-medium ${canAfford ? "text-green-600" : "text-red-600"}`}>
                    <Coins className="w-4 h-4 inline mr-1" />
                    {user.points - totalCost}
                  </span>
                </div>
              </div>

              {!canAfford && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-700">
                      You need {totalCost - user.points} more points to redeem this item.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={targetItem.uploaderAvatar || "/placeholder.svg"} alt={targetItem.uploaderName} />
                  <AvatarFallback>{targetItem.uploaderName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{targetItem.uploaderName}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {targetItem.uploaderLocation.city}, {targetItem.uploaderLocation.state}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleNext} disabled={!canAfford}>
              Next: Shipping Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Shipping Address */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special delivery instructions..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>From:</span>
                  <span>
                    {targetItem.uploaderLocation.city}, {targetItem.uploaderLocation.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span>
                    {shippingAddress.city}, {shippingAddress.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated delivery:</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {shippingCost === 0 ? "2-3 days" : "5-7 days"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping cost:</span>
                  <span className={shippingCost === 0 ? "text-green-600" : "text-orange-600"}>
                    {shippingCost === 0 ? "Free (Same city)" : `${shippingCost} points`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Next: Confirm Order</Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Order Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div>
                <h4 className="font-medium mb-3">Order Summary</h4>
                <div className="flex gap-4 p-4 border rounded-lg">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={targetItem.images[0] || "/placeholder.svg"}
                      alt={targetItem.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{targetItem.title}</h5>
                    <p className="text-sm text-muted-foreground">
                      Size: {targetItem.size} • {targetItem.condition}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        <Coins className="w-3 h-3 mr-1" />
                        {totalCost} total
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h4 className="font-medium mb-3">Shipping Address</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{shippingAddress.fullName}</div>
                    <div>{shippingAddress.address}</div>
                    <div>
                      {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                    </div>
                    <div>Phone: {shippingAddress.phone}</div>
                    {specialInstructions && (
                      <div className="mt-2 pt-2 border-t">
                        <span className="font-medium">Special Instructions: </span>
                        {specialInstructions}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Summary */}
              <div>
                <h4 className="font-medium mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Item cost:</span>
                    <span>{targetItem.pointsCost} points</span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{shippingCost} points</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{totalCost} points</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining balance:</span>
                    <span className="text-green-600">{user.points - totalCost} points</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Purchase Protection</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Your points will be held until delivery is confirmed</li>
                      <li>• You can report issues within 7 days of delivery</li>
                      <li>• Full refund available if item doesn't match description</li>
                    </ul>
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
                "Processing..."
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  Confirm Redemption
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
