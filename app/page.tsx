"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Recycle, Users, Leaf, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/contexts/app-context"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { items } = useApp()
  const [currentSlide, setCurrentSlide] = useState(0)

  const featuredItems = items.filter((item) => item.status === "available").slice(0, 5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [featuredItems.length])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="mb-4">
                <Leaf className="w-3 h-3 mr-1" />
                Sustainable Fashion
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Promoting sustainable fashion & reducing <span className="text-primary">textile waste</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join our community of eco-conscious fashion lovers. Swap, share, and discover pre-loved clothing while
                making a positive impact on the planet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="group">
                <Link href="/browse">
                  Start Swapping
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/browse">Browse Items</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/add-item">List an Item</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ReWear Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, sustainable, and rewarding. Join thousands of users making fashion circular.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Recycle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">List Your Items</h3>
                <p className="text-muted-foreground">
                  Upload photos of clothes you no longer wear and earn swap points for each approved item.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Browse & Swap</h3>
                <p className="text-muted-foreground">
                  Discover amazing pre-loved items from our community and use your points to claim them.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Make Impact</h3>
                <p className="text-muted-foreground">
                  Reduce textile waste, save money, and refresh your wardrobe sustainably.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Items</h2>
            <p className="text-lg text-muted-foreground">Discover amazing pieces from our community</p>
          </div>

          {featuredItems.length > 0 && (
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredItems.map((item) => (
                    <div key={item.id} className="w-full flex-shrink-0">
                      <Card className="mx-2">
                        <div className="grid md:grid-cols-2 gap-6 p-6">
                          <div className="relative aspect-square rounded-lg overflow-hidden">
                            <Image
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-4 flex flex-col justify-center">
                            <div>
                              <Badge variant="secondary" className="mb-2">
                                {item.category}
                              </Badge>
                              <h3 className="text-2xl font-bold">{item.title}</h3>
                              <p className="text-muted-foreground mt-2">{item.description}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Size:</span>
                                <Badge variant="outline">{item.size}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Condition:</span>
                                <Badge variant="outline">{item.condition}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Points:</span>
                                <Badge className="bg-yellow-100 text-yellow-800">{item.pointsCost}</Badge>
                              </div>
                            </div>
                            <Button asChild className="w-fit">
                              <Link href={`/items/${item.id}`}>
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {featuredItems.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? "bg-primary" : "bg-muted"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">10K+</div>
              <div className="text-sm opacity-90">Items Swapped</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">5K+</div>
              <div className="text-sm opacity-90">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">2.5T</div>
              <div className="text-sm opacity-90">CO₂ Saved (kg)</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">98%</div>
              <div className="text-sm opacity-90">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center p-8 md:p-12">
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Ready to start your sustainable fashion journey?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of fashion lovers who are making a difference. Start swapping today and earn your first
                50 points!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">Join ReWear Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/browse">Explore Items</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
