"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Coins, ShoppingBasket, User, Calendar, Tag, MapPin, Star, ArrowUpDown, Heart } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { items, addToBasket, user } = useApp()
  const { toast } = useToast()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [swapDialogOpen, setSwapDialogOpen] = useState(false)
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false)

  const item = items.find((item) => item.id === params.id)

  if (!item) {
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

  const handleAddToBasket = () => {
    addToBasket(item)
    toast({
      title: "Added to basket!",
      description: `${item.title} has been added to your swap basket.`,
    })
  }

  const getShippingCost = () => {
    if (!user) return 0
    return item.uploaderLocation.city === user.location.city ? 0 : 50
  }

  const shippingCost = getShippingCost()
  const totalCost = item.pointsCost + shippingCost

  // Mock uploader details
  const uploaderDetails = {
    ...item,
    uploaderTrustMetrics: {
      swapSuccessRate: 92,
      totalSwaps: 8,
      rating: 4.6,
    },
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={item.images[selectedImageIndex] || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover"
            />
            {item.isNGODonation && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-100 text-green-800">
                  <Heart className="w-3 h-3 mr-1" />
                  NGO Donation
                </Badge>
              </div>
            )}
          </div>

          {item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                    index === selectedImageIndex ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${item.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{item.category}</Badge>
              <Badge
                variant={item.status === "available" ? "default" : item.status === "reserved" ? "secondary" : "outline"}
              >
                {item.status}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.uploaderLocation.city}, {item.uploaderLocation.state}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <p className="text-lg text-muted-foreground">{item.description}</p>
          </div>

          {/* Detailed Specifications */}
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="seller">Seller Info</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Brand</Label>
                      <p className="font-medium">{item.specifications.brand || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Material</Label>
                      <p className="font-medium">{item.specifications.material || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Color</Label>
                      <p className="font-medium">{item.specifications.color}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Pattern</Label>
                      <p className="font-medium">{item.specifications.pattern || "Not specified"}</p>
                    </div>
                    {item.specifications.sleeve && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Sleeve</Label>
                        <p className="font-medium">{item.specifications.sleeve}</p>
                      </div>
                    )}
                    {item.specifications.neckline && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Neckline</Label>
                        <p className="font-medium">{item.specifications.neckline}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Fit</Label>
                      <p className="font-medium">{item.specifications.fit || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Occasion</Label>
                      <p className="font-medium">{item.specifications.occasion || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Season</Label>
                      <p className="font-medium">{item.specifications.season || "Not specified"}</p>
                    </div>
                  </div>

                  {item.specifications.careInstructions && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                          Care Instructions
                        </Label>
                        <p className="text-sm bg-muted p-3 rounded-md">{item.specifications.careInstructions}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Item Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <p className="font-medium">{item.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <p className="font-medium">{item.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Size</Label>
                      <p className="font-medium">{item.size}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Condition</Label>
                      <p className="font-medium">{item.condition}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Base Points</Label>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Coins className="w-3 h-3 mr-1" />
                        {item.pointsCost}
                      </Badge>
                    </div>

                    {shippingCost > 0 && (
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">Shipping (Intercity)</Label>
                        <Badge variant="outline">
                          <Coins className="w-3 h-3 mr-1" />+{shippingCost}
                        </Badge>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Total Cost</Label>
                      <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                        <Coins className="w-4 h-4 mr-1" />
                        {totalCost}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seller Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={item.uploaderAvatar || "/placeholder.svg"} alt={item.uploaderName} />
                      <AvatarFallback>{item.uploaderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.uploaderName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.uploaderLocation.city}, {item.uploaderLocation.state}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Listed {item.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {uploaderDetails.uploaderTrustMetrics.swapSuccessRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{uploaderDetails.uploaderTrustMetrics.totalSwaps}</div>
                      <div className="text-xs text-muted-foreground">Total Swaps</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{uploaderDetails.uploaderTrustMetrics.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/profile/${item.uploaderId}`}>
                      <User className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {item.status === "available" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button className="w-full" asChild>
                  <Link href={`/swap/${item.id}`}>
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Exchange
                  </Link>
                </Button>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/redeem/${item.id}`}>
                    <Coins className="w-4 h-4 mr-2" />
                    Redeem ({totalCost} pts)
                  </Link>
                </Button>
              </div>

              <Button variant="outline" className="w-full bg-transparent" onClick={handleAddToBasket}>
                <ShoppingBasket className="w-4 h-4 mr-2" />
                Add to Basket
              </Button>
            </div>
          )}

          {item.status === "reserved" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-1">Item Reserved</h3>
              <p className="text-sm text-yellow-700">This item is currently reserved for another user.</p>
            </div>
          )}

          {item.status === "swapped" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-1">Item Swapped</h3>
              <p className="text-sm text-gray-700">This item has already been swapped.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
