"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Coins, MapPin, Truck } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface RedeemDialogProps {
  item: any
  totalCost: number
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
}

export function RedeemDialog({ item, totalCost, open, onOpenChange, trigger }: RedeemDialogProps) {
  const { user, createRedeemRequest } = useApp()
  const { toast } = useToast()

  if (!user) return null

  const canAfford = user.points >= totalCost
  const shippingCost = item.uploaderLocation.city === user.location.city ? 0 : 50

  const handleRedeem = () => {
    if (!canAfford) {
      toast({
        title: "Insufficient points",
        description: `You need ${totalCost} points but only have ${user.points}.`,
        variant: "destructive",
      })
      return
    }

    createRedeemRequest(item.id)

    toast({
      title: "Redeem request sent!",
      description: `Your redemption request for "${item.title}" has been sent for approval.`,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Redeem with Points</DialogTitle>
          <DialogDescription>Use your swap points to claim this item directly</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image src={item.images[0] || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {item.condition}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Cost Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Item cost:</span>
                  <span className="font-medium">{item.pointsCost} points</span>
                </div>

                {shippingCost > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm">
                      <Truck className="w-3 h-3" />
                      <span>Shipping ({item.uploaderLocation.city}):</span>
                    </div>
                    <span className="font-medium">{shippingCost} points</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total cost:</span>
                  <Badge className="bg-primary text-primary-foreground">
                    <Coins className="w-3 h-3 mr-1" />
                    {totalCost} points
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Your balance:</span>
                  <span className={`font-medium ${canAfford ? "text-green-600" : "text-red-600"}`}>
                    {user.points} points
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm">After redemption:</span>
                  <span className={`font-medium ${canAfford ? "text-green-600" : "text-red-600"}`}>
                    {user.points - totalCost} points
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Delivery Information</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  From: {item.uploaderLocation.city}, {item.uploaderLocation.state}
                </p>
                <p>
                  To: {user.location.city}, {user.location.state}
                </p>
                {shippingCost === 0 ? (
                  <p className="text-green-600 mt-1">✓ Same city - No shipping charges</p>
                ) : (
                  <p className="text-orange-600 mt-1">⚠ Intercity delivery - Additional charges apply</p>
                )}
              </div>
            </CardContent>
          </Card>

          {!canAfford && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                You need {totalCost - user.points} more points to redeem this item.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleRedeem} className="flex-1" disabled={!canAfford}>
              <Coins className="w-4 h-4 mr-2" />
              Confirm Redemption
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
