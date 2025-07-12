"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpDown, MessageSquare, Clock, CheckCircle, XCircle, Truck, Package, Send, MapPin } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

export default function SwapsPage() {
  const { user, isAuthenticated, swapRequests, sendChatMessage, updateSwapRequestStatus } = useApp()
  const router = useRouter()
  const { toast } = useToast()

  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const sentRequests = swapRequests.filter((req) => req.requesterId === user.id)
  const receivedRequests = swapRequests.filter((req) => req.requesterId !== user.id)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRequest) return

    sendChatMessage(selectedRequest.id, newMessage)
    setNewMessage("")

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    })
  }

  const handleAcceptRequest = (requestId: string) => {
    updateSwapRequestStatus(requestId, "accepted")
    toast({
      title: "Request accepted",
      description: "The swap request has been accepted. You can now proceed with the exchange.",
    })
  }

  const handleRejectRequest = (requestId: string) => {
    updateSwapRequestStatus(requestId, "rejected")
    toast({
      title: "Request rejected",
      description: "The swap request has been rejected.",
      variant: "destructive",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "proposed":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-500" />
      case "delivered":
        return <Package className="w-4 h-4 text-purple-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "proposed":
        return "secondary"
      case "accepted":
        return "default"
      case "rejected":
        return "destructive"
      case "shipped":
        return "outline"
      case "delivered":
        return "outline"
      case "completed":
        return "default"
      default:
        return "secondary"
    }
  }

  const SwapRequestCard = ({ request, isSent }: { request: any; isSent: boolean }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRequest(request)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(request.status)}
              <Badge variant={getStatusColor(request.status) as any}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div>
            <h4 className="font-medium">{request.targetItemTitle}</h4>
            <p className="text-sm text-muted-foreground">
              {isSent ? `Requested from ${request.requesterName}` : `Request from ${request.requesterName}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Offered items: {request.offeredItemTitles.length}</span>
            {request.pointsDifference !== 0 && (
              <Badge variant="outline" className="text-xs">
                {request.pointsDifference > 0 ? `+${request.pointsDifference}` : request.pointsDifference} pts
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={request.requesterAvatar || "/placeholder.svg"} />
              <AvatarFallback>{request.requesterName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{request.requesterName}</span>
            {request.chatMessages.length > 1 && (
              <Badge variant="outline" className="text-xs ml-auto">
                <MessageSquare className="w-3 h-3 mr-1" />
                {request.chatMessages.length}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Swaps</h1>
          <p className="text-muted-foreground mt-1">Manage your swap requests and exchanges</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Swap Requests List */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="received" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received">Received ({receivedRequests.length})</TabsTrigger>
              <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="space-y-4">
              {receivedRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ArrowUpDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No requests received</h3>
                    <p className="text-sm text-muted-foreground">Swap requests from other users will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                receivedRequests.map((request) => <SwapRequestCard key={request.id} request={request} isSent={false} />)
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {sentRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ArrowUpDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No requests sent</h3>
                    <p className="text-sm text-muted-foreground">Your swap requests will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                sentRequests.map((request) => <SwapRequestCard key={request.id} request={request} isSent={true} />)
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Swap Details & Chat */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <div className="space-y-6">
              {/* Request Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ArrowUpDown className="h-5 w-5" />
                      Swap Request Details
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedRequest.status)}
                      <Badge variant={getStatusColor(selectedRequest.status) as any}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Target Item */}
                    <div>
                      <h4 className="font-medium mb-3">Requested Item</h4>
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium">{selectedRequest.targetItemTitle}</h5>
                        <p className="text-sm text-muted-foreground">Target item details</p>
                      </div>
                    </div>

                    {/* Offered Items */}
                    <div>
                      <h4 className="font-medium mb-3">Offered Items</h4>
                      <div className="space-y-2">
                        {selectedRequest.offeredItemTitles.map((title: string, index: number) => (
                          <div key={index} className="border rounded-lg p-3">
                            <h5 className="font-medium">{title}</h5>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedRequest.pointsDifference !== 0 && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Points Difference:</span>
                        <Badge variant="outline">
                          {selectedRequest.pointsDifference > 0
                            ? `+${selectedRequest.pointsDifference}`
                            : selectedRequest.pointsDifference}{" "}
                          points
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {selectedRequest.status === "proposed" && selectedRequest.requesterId !== user.id && (
                    <div className="flex gap-2">
                      <Button onClick={() => handleAcceptRequest(selectedRequest.id)} className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Request
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRejectRequest(selectedRequest.id)}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Request
                      </Button>
                    </div>
                  )}

                  {selectedRequest.status === "accepted" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-green-800">Request Accepted!</h4>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Both parties have agreed to the swap. Shipping addresses will be revealed once both users
                        confirm.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span>Next: Exchange shipping details</span>
                        </div>
                        <Button size="sm" className="w-full">
                          Confirm & Share Address
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat with {selectedRequest.requesterName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Messages */}
                    <div className="max-h-64 overflow-y-auto space-y-3 border rounded-lg p-4">
                      {selectedRequest.chatMessages.map((message: any) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg ${
                              message.senderId === user.id ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={2}
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-16 text-center">
                <ArrowUpDown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Select a swap request</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a swap request from the list to view details and chat.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
