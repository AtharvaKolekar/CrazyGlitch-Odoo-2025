"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Coins, Plus, Package, ArrowUpDown, CheckCircle, Clock, Eye } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import Link from "next/link"
import Image from "next/image"
import { useUser } from "@/lib/auth"

export default function DashboardPage() {
  const { user, isAuthenticated, items } = useApp()
  const router = useRouter()
  // const user = useUser()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const userItems = items.filter((item) => item.uploaderId === user.id)
  const ongoingSwaps = [
    {
      id: "1",
      yourItem: "Casual Cotton T-Shirt",
      theirItem: "Vintage Band Tee",
      otherUser: "Sarah Chen",
      status: "pending",
      date: "2024-01-15",
    },
  ]
  const completedSwaps = [
    {
      id: "1",
      yourItem: "Summer Dress",
      theirItem: "Denim Jacket",
      otherUser: "Emma Wilson",
      status: "completed",
      date: "2024-01-10",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback className="text-lg">{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription className="mt-1">{user.bio}</CardDescription>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-lg">{user.points}</span>
                  <span className="text-sm text-muted-foreground">swap points</span>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/add-item">
                    <Plus className="h-4 w-4 mr-2" />
                    Earn More Points
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Your Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Your Items ({userItems.length})
                </CardTitle>
                <Button size="sm" asChild>
                  <Link href="/add-item">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {userItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No items yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start by listing your first item to earn swap points!
                  </p>
                  <Button asChild>
                    <Link href="/add-item">List Your First Item</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {userItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="relative aspect-square rounded-md overflow-hidden">
                        <Image
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium truncate">{item.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <Badge
                            variant={
                              item.status === "available"
                                ? "default"
                                : item.status === "pending"
                                  ? "secondary"
                                  : item.status === "reserved"
                                    ? "outline"
                                    : "destructive"
                            }
                          >
                            {item.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <Coins className="h-3 w-3 text-yellow-500" />
                            {item.pointsCost}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/items/${item.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ongoing Swaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Ongoing Swaps ({ongoingSwaps.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ongoingSwaps.length === 0 ? (
                <div className="text-center py-8">
                  <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No ongoing swaps</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse items and start swapping to see your active exchanges here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ongoingSwaps.map((swap) => (
                    <div key={swap.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                        <span className="text-sm text-muted-foreground">{swap.date}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Your item:</span>
                          <span className="font-medium">{swap.yourItem}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Their item:</span>
                          <span className="font-medium">{swap.theirItem}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">With:</span>
                          <span className="font-medium">{swap.otherUser}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Items Listed</span>
                <span className="font-semibold">{userItems.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Swaps</span>
                <span className="font-semibold">{ongoingSwaps.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed Swaps</span>
                <span className="font-semibold">{completedSwaps.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Points Earned</span>
                <span className="font-semibold text-green-600">+{userItems.length * 50}</span>
              </div>
            </CardContent>
          </Card>

          {/* Completed Swaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5" />
                Recent Completed Swaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedSwaps.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No completed swaps yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedSwaps.map((swap) => (
                    <div key={swap.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-muted-foreground">Swapped:</span>
                          <span className="ml-1">{swap.yourItem}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">For:</span>
                          <span className="ml-1">{swap.theirItem}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">With:</span>
                          <span className="ml-1">{swap.otherUser}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">{swap.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Points Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Coins className="h-5 w-5 text-yellow-500" />
                How Swap Points Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div>
                  <span className="font-medium">Earn 50 points</span> for each approved item you list
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div>
                  <span className="font-medium">Spend points</span> to claim items from other users
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <div>
                  <span className="font-medium">Higher quality items</span> cost more points
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-4 bg-transparent" asChild>
                <Link href="/add-item">
                  <Plus className="h-4 w-4 mr-2" />
                  List an Item
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
