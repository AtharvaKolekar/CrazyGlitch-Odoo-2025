"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Check, X, Eye, Trash2, Settings, Coins, Heart } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function AdminPage() {
  const { user, isAuthenticated, items, categoryPoints, updateCategoryPoints } = useApp()
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [itemStatuses, setItemStatuses] = useState<Record<string, string>>({})
  const [editingPoints, setEditingPoints] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    setEditingPoints(categoryPoints)
  }, [categoryPoints])

  if (!isAuthenticated || !user?.isAdmin) {
    return null
  }

  const pendingItems = items.filter((item) => item.status === "pending")
  const ngoItems = items.filter((item) => item.isNGODonation)

  const filteredItems = pendingItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uploaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleApprove = (itemId: string) => {
    setItemStatuses((prev) => ({ ...prev, [itemId]: "approved" }))
    toast({
      title: "Item approved",
      description: "The item has been approved and is now available for swap.",
    })
  }

  const handleReject = (itemId: string) => {
    setItemStatuses((prev) => ({ ...prev, [itemId]: "rejected" }))
    toast({
      title: "Item rejected",
      description: "The item has been rejected and the uploader will be notified.",
      variant: "destructive",
    })
  }

  const handleDelete = (itemId: string) => {
    setItemStatuses((prev) => ({ ...prev, [itemId]: "deleted" }))
    toast({
      title: "Item deleted",
      description: "The item has been permanently deleted.",
      variant: "destructive",
    })
  }

  const handleUpdatePoints = (category: string) => {
    const newPoints = editingPoints[category]
    if (newPoints && newPoints > 0) {
      updateCategoryPoints(category, newPoints)
      toast({
        title: "Points updated",
        description: `${category} items now earn ${newPoints} points.`,
      })
    }
  }

  const getItemStatus = (itemId: string) => {
    return itemStatuses[itemId] || "pending"
  }

  const stats = {
    totalItems: items.length,
    pendingItems: pendingItems.length,
    approvedItems: items.filter((item) => item.status === "available").length,
    ngoItems: ngoItems.length,
    totalUsers: 5,
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage pending items, points, and moderate content</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NGO Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.ngoItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Items ({stats.pendingItems})</TabsTrigger>
          <TabsTrigger value="points">Category Points</TabsTrigger>
          <TabsTrigger value="ngo">NGO Donations ({stats.ngoItems})</TabsTrigger>
        </TabsList>

        {/* Pending Items Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Pending Items ({filteredItems.length})</CardTitle>
                  <CardDescription>Review and approve items submitted by users</CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-[300px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No pending items</h3>
                  <p className="text-sm text-muted-foreground">All items have been reviewed. Great job!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Uploader</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => {
                        const status = getItemStatus(item.id)
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                  <Image
                                    src={item.images[0] || "/placeholder.svg"}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {item.size} • {item.condition}
                                  </div>
                                  {item.isNGODonation && (
                                    <Badge variant="outline" className="text-xs mt-1">
                                      <Heart className="w-3 h-3 mr-1 text-red-500" />
                                      NGO
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={item.uploaderAvatar || "/placeholder.svg"} />
                                  <AvatarFallback>{item.uploaderName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{item.uploaderName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Coins className="w-3 h-3 mr-1" />
                                {categoryPoints[item.category] || 100}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.createdAt}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  status === "approved"
                                    ? "default"
                                    : status === "rejected"
                                      ? "destructive"
                                      : status === "deleted"
                                        ? "destructive"
                                        : "secondary"
                                }
                              >
                                {status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedItem(item)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Review Item</DialogTitle>
                                      <DialogDescription>
                                        Review the item details before making a decision
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedItem && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="relative aspect-square rounded-lg overflow-hidden">
                                            <Image
                                              src={selectedItem.images[0] || "/placeholder.svg"}
                                              alt={selectedItem.title}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div className="space-y-3">
                                            <div>
                                              <h3 className="font-semibold">{selectedItem.title}</h3>
                                              <p className="text-sm text-muted-foreground mt-1">
                                                {selectedItem.description}
                                              </p>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                              <div>
                                                <span className="font-medium">Category:</span> {selectedItem.category}
                                              </div>
                                              <div>
                                                <span className="font-medium">Type:</span> {selectedItem.type}
                                              </div>
                                              <div>
                                                <span className="font-medium">Size:</span> {selectedItem.size}
                                              </div>
                                              <div>
                                                <span className="font-medium">Condition:</span> {selectedItem.condition}
                                              </div>
                                              <div>
                                                <span className="font-medium">Brand:</span>{" "}
                                                {selectedItem.specifications.brand || "N/A"}
                                              </div>
                                              <div>
                                                <span className="font-medium">Color:</span>{" "}
                                                {selectedItem.specifications.color}
                                              </div>
                                              <div>
                                                <span className="font-medium">Uploader:</span>{" "}
                                                {selectedItem.uploaderName}
                                              </div>
                                            </div>
                                            {selectedItem.tags.length > 0 && (
                                              <div className="flex flex-wrap gap-1">
                                                {selectedItem.tags.map((tag: string) => (
                                                  <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                {status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleApprove(item.id)}
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleReject(item.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Points Tab */}
        <TabsContent value="points">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Category Points Management
              </CardTitle>
              <CardDescription>Set the points users earn for each category of items they list</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(categoryPoints).map(([category, points]) => (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{category}</h4>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Coins className="w-3 h-3 mr-1" />
                            {points}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={editingPoints[category] || points}
                            onChange={(e) =>
                              setEditingPoints((prev) => ({
                                ...prev,
                                [category]: Number.parseInt(e.target.value) || 0,
                              }))
                            }
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleUpdatePoints(category)}
                            disabled={editingPoints[category] === points}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NGO Donations Tab */}
        <TabsContent value="ngo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                NGO Donations
              </CardTitle>
              <CardDescription>Items marked as NGO donations for charitable purposes</CardDescription>
            </CardHeader>
            <CardContent>
              {ngoItems.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-16 h-16 text-red-200 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No NGO donations yet</h3>
                  <p className="text-sm text-muted-foreground">
                    NGO donation items will appear here when users mark their items for donation.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ngoItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="relative aspect-square rounded-md overflow-hidden">
                            <Image
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                            <Badge className="absolute top-2 right-2 bg-red-100 text-red-800">
                              <Heart className="w-3 h-3 mr-1" />
                              NGO
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.category} • Size {item.size}
                            </p>
                            <p className="text-sm text-muted-foreground">By {item.uploaderName}</p>
                          </div>
                          <Badge
                            variant={
                              item.status === "available"
                                ? "default"
                                : item.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
