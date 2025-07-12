"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Search, Filter, Coins, ShoppingBasket, SlidersHorizontal, MapPin, Heart } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const categories = [
  "All",
  "Denim",
  "Shirts",
  "Kurti",
  "Trousers",
  "T-Shirts",
  "Kidswear",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
]
const sizes = ["All", "XS", "S", "M", "L", "XL", "XXL", "2-3 Years", "4-5 Years", "6-7 Years"]
const conditions = ["All", "Like New", "Excellent", "Good", "Fair"]
const colors = ["All", "Red", "Blue", "Green", "Yellow", "Black", "White", "Pink", "Purple", "Orange", "Brown", "Gray"]
const cities = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]

export default function BrowsePage() {
  const { items, addToBasket, user, categoryPoints } = useApp()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSize, setSelectedSize] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [selectedColor, setSelectedColor] = useState("All")
  const [selectedCity, setSelectedCity] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [showNGOOnly, setShowNGOOnly] = useState(false)
  const [sameCityOnly, setSameCityOnly] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const availableItems = items.filter((item) => item.status === "available")

  const filteredItems = useMemo(() => {
    const filtered = availableItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.specifications.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specifications.material?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesSize = selectedSize === "All" || item.size === selectedSize
      const matchesCondition = selectedCondition === "All" || item.condition === selectedCondition
      const matchesColor =
        selectedColor === "All" || item.specifications.color.toLowerCase().includes(selectedColor.toLowerCase())
      const matchesCity = selectedCity === "All" || item.uploaderLocation.city === selectedCity
      const matchesNGO = !showNGOOnly || item.isNGODonation
      const matchesSameCity = !sameCityOnly || !user || item.uploaderLocation.city === user.location.city

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSize &&
        matchesCondition &&
        matchesColor &&
        matchesCity &&
        matchesNGO &&
        matchesSameCity
      )
    })

    // Sort items
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "points-low":
        filtered.sort((a, b) => a.pointsCost - b.pointsCost)
        break
      case "points-high":
        filtered.sort((a, b) => b.pointsCost - a.pointsCost)
        break
    }

    return filtered
  }, [
    availableItems,
    searchQuery,
    selectedCategory,
    selectedSize,
    selectedCondition,
    selectedColor,
    selectedCity,
    sortBy,
    showNGOOnly,
    sameCityOnly,
    user,
  ])

  const handleAddToBasket = (item: any) => {
    addToBasket(item)
    toast({
      title: "Added to basket!",
      description: `${item.title} has been added to your swap basket.`,
    })
  }

  const getShippingCost = (itemCity: string) => {
    if (!user) return 0
    return itemCity === user.location.city ? 0 : 50 // Additional 50 points for intercity
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search items, brands, materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="ngo-only" checked={showNGOOnly} onCheckedChange={setShowNGOOnly} />
          <Label htmlFor="ngo-only" className="text-sm">
            NGO Donations Only
          </Label>
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <Switch id="same-city" checked={sameCityOnly} onCheckedChange={setSameCityOnly} />
            <Label htmlFor="same-city" className="text-sm">
              Same City Only ({user.location.city})
            </Label>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category} {category !== "All" && `(${categoryPoints[category]} pts)`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Size</Label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="points-low">Points: Low to High</SelectItem>
            <SelectItem value="points-high">Points: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          setSearchQuery("")
          setSelectedCategory("All")
          setSelectedSize("All")
          setSelectedCondition("All")
          setSelectedColor("All")
          setSelectedCity("All")
          setSortBy("newest")
          setShowNGOOnly(false)
          setSameCityOnly(false)
        }}
      >
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5" />
                <h2 className="font-semibold">Filters</h2>
              </div>
              <FilterContent />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Browse Items</h1>
              <p className="text-muted-foreground mt-1">
                {filteredItems.length} items available for swap
                {sameCityOnly && user && ` in ${user.location.city}`}
              </p>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No items found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Try adjusting your filters or search terms to find more items.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const shippingCost = getShippingCost(item.uploaderLocation.city)
                const totalCost = item.pointsCost + shippingCost

                return (
                  <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <Image
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Coins className="w-3 h-3 mr-1" />
                            {totalCost}
                          </Badge>
                          {item.isNGODonation && (
                            <Badge className="bg-green-100 text-green-800">
                              <Heart className="w-3 h-3 mr-1" />
                              NGO
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className="bg-white/90">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.uploaderLocation.city}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                        </div>

                        {/* Specifications Preview */}
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Brand:</span>
                            <span className="font-medium">{item.specifications.brand || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Color:</span>
                            <span className="font-medium">{item.specifications.color}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Material:</span>
                            <span className="font-medium">{item.specifications.material || "N/A"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Size {item.size}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.condition}
                          </Badge>
                        </div>

                        {shippingCost > 0 && (
                          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                            +{shippingCost} pts for intercity shipping
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                              <Image
                                src={item.uploaderAvatar || "/placeholder.svg"}
                                alt={item.uploaderName}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{item.uploaderName}</span>
                          </div>
                          <Badge variant="default" className="text-xs">
                            Available
                          </Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/items/${item.id}`}>View Details</Link>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAddToBasket(item)}>
                            <ShoppingBasket className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
