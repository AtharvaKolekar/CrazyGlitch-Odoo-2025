"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Upload, X, Plus, ArrowRight, ArrowLeft, Check, Heart } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const categories = [
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
const types = {
  Denim: ["Jeans", "Jacket", "Skirt", "Shorts"],
  Shirts: ["Formal Shirt", "Casual Shirt", "Polo Shirt"],
  Kurti: ["Casual Kurti", "Formal Kurti", "Party Kurti"],
  Trousers: ["Formal Trousers", "Casual Trousers", "Chinos"],
  "T-Shirts": ["Casual T-Shirt", "Graphic T-Shirt", "Plain T-Shirt"],
  Kidswear: ["Dress", "T-Shirt", "Pants", "Shorts", "Jacket"],
  Dresses: ["Casual Dress", "Formal Dress", "Party Dress", "Maxi Dress"],
  Outerwear: ["Jacket", "Coat", "Blazer", "Cardigan", "Vest"],
  Shoes: ["Sneakers", "Boots", "Heels", "Flats", "Sandals"],
  Accessories: ["Bag", "Hat", "Scarf", "Jewelry", "Belt"],
}
const sizes = ["XS", "S", "M", "L", "XL", "XXL", "2-3 Years", "4-5 Years", "6-7 Years", "8-9 Years"]
const conditions = ["Like New", "Excellent", "Good", "Fair"]
const colors = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Gray",
  "Multi-color",
]
const patterns = ["Solid", "Stripes", "Floral", "Geometric", "Abstract", "Animal Print", "Polka Dots"]
const materials = ["Cotton", "Polyester", "Silk", "Wool", "Denim", "Linen", "Blend", "Synthetic"]
const fits = ["Regular Fit", "Slim Fit", "Loose Fit", "Oversized", "Tight Fit"]
const occasions = ["Casual", "Formal", "Party", "Sports", "Work", "Festive"]
const seasons = ["All Season", "Summer", "Winter", "Monsoon", "Spring"]
const suggestedTags = ["vintage", "designer", "casual", "formal", "summer", "winter", "cotton", "denim", "silk", "wool"]

export default function AddItemPage() {
  const { isAuthenticated, categoryPoints, user } = useApp()
  const router = useRouter()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: [] as string[],
    images: [] as string[],
    specifications: {
      brand: "",
      material: "",
      color: "",
      pattern: "",
      sleeve: "",
      neckline: "",
      fit: "",
      occasion: "",
      season: "",
      careInstructions: "",
    },
    isNGODonation: false,
  })
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=400&width=400&text=Image${formData.images.length + index + 1}`,
      )
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5),
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const addSuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.images.length > 0
      case 2:
        return formData.title && formData.description
      case 3:
        return formData.category && formData.type && formData.size && formData.condition
      case 4:
        return formData.specifications.color
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const pointsToEarn = categoryPoints[formData.category] || 100

    toast({
      title: "Item submitted successfully!",
      description: `Your item is now pending approval. You'll earn ${pointsToEarn} points once it's approved.`,
    })

    setIsSubmitting(false)
    router.push("/dashboard")
  }

  const progress = (currentStep / 5) * 100
  const expectedPoints = formData.category ? categoryPoints[formData.category] || 100 : 100

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">List a New Item</h1>
        <p className="text-muted-foreground">Share your pre-loved clothing and earn swap points</p>
        <Progress value={progress} className="mt-4" />
        <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of 5</p>

        {formData.category && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              💰 You'll earn <strong>{expectedPoints} points</strong> for this {formData.category} item once approved!
            </p>
          </div>
        )}
      </div>

      {/* Step 1: Images */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Photos</CardTitle>
            <CardDescription>
              Add up to 5 high-quality photos of your item. The first photo will be the main image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image src={image || "/placeholder.svg"} alt={`Upload ${index + 1}`} fill className="object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && <Badge className="absolute bottom-2 left-2 text-xs">Main</Badge>}
                </div>
              ))}

              {formData.images.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground text-center">Add Photo</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!validateStep(1)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Basic Info */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
            <CardDescription>Provide a clear title and detailed description of your item.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Vintage Denim Jacket"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the item's condition, style, fit, and any other relevant details..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ngo-donation"
                checked={formData.isNGODonation}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isNGODonation: checked }))}
              />
              <Label htmlFor="ngo-donation" className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Donate to NGO (This item will be marked as an NGO donation)
              </Label>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!validateStep(2)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Category & Details */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Category & Details</CardTitle>
            <CardDescription>Specify the category, size, and condition of your item.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value, type: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category} ({categoryPoints[category]} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category &&
                      types[formData.category as keyof typeof types]?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Size *</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, size: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
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
                <Label>Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
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
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!validateStep(3)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Specifications */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Product Specifications</CardTitle>
            <CardDescription>Add detailed specifications to help buyers find your item.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input
                  placeholder="e.g., Levi's, H&M, Zara"
                  value={formData.specifications.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, brand: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Material</Label>
                <Select
                  value={formData.specifications.material}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, material: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color *</Label>
                <Select
                  value={formData.specifications.color}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, color: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
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
                <Label>Pattern</Label>
                <Select
                  value={formData.specifications.pattern}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, pattern: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {patterns.map((pattern) => (
                      <SelectItem key={pattern} value={pattern}>
                        {pattern}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fit</Label>
                <Select
                  value={formData.specifications.fit}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, fit: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fit" />
                  </SelectTrigger>
                  <SelectContent>
                    {fits.map((fit) => (
                      <SelectItem key={fit} value={fit}>
                        {fit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Occasion</Label>
                <Select
                  value={formData.specifications.occasion}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, occasion: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasions.map((occasion) => (
                      <SelectItem key={occasion} value={occasion}>
                        {occasion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Season</Label>
                <Select
                  value={formData.specifications.season}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, season: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season} value={season}>
                        {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Care Instructions</Label>
              <Textarea
                placeholder="e.g., Machine wash cold, tumble dry low, do not bleach"
                value={formData.specifications.careInstructions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specifications: { ...prev.specifications, careInstructions: e.target.value },
                  }))
                }
                rows={2}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!validateStep(4)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Tags & Submit */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags & Submit</CardTitle>
            <CardDescription>Add tags to help others find your item. Then submit for approval.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Add Tags (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} disabled={!newTag || formData.tags.length >= 10}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Suggested Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((tag) => !formData.tags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => addSuggestedTag(tag)}
                      >
                        {tag}
                        <Plus className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Review Your Item</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Title:</span> {formData.title}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {formData.category} - {formData.type}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {formData.size}
                </div>
                <div>
                  <span className="font-medium">Condition:</span> {formData.condition}
                </div>
                <div>
                  <span className="font-medium">Color:</span> {formData.specifications.color}
                </div>
                <div>
                  <span className="font-medium">Photos:</span> {formData.images.length} uploaded
                </div>
                <div>
                  <span className="font-medium">Expected Points:</span> {expectedPoints}
                </div>
                {formData.isNGODonation && (
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-red-600">NGO Donation</span>
                  </div>
                )}
                {formData.tags.length > 0 && (
                  <div>
                    <span className="font-medium">Tags:</span> {formData.tags.join(", ")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Submit Item
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
