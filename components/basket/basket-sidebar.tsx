"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Coins } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface BasketSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BasketSidebar({ open, onOpenChange }: BasketSidebarProps) {
  const { basketItems, removeFromBasket, clearBasket, user } = useApp()
  const { toast } = useToast()

  const totalPoints = basketItems.reduce((sum, item) => sum + item.pointsCost * item.quantity, 0)
  const userPoints = user?.points || 0
  const canAfford = userPoints >= totalPoints

  const handleProceedToSwap = () => {
    if (!canAfford) {
      toast({
        title: "Insufficient Points",
        description: "You don't have enough points for this swap.",
        variant: "destructive",
      })
      return
    }

    // Mock checkout process
    toast({
      title: "Swap Request Sent!",
      description: "Your swap requests have been sent to the item owners.",
    })
    clearBasket()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Swap Basket</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto py-4">
            {basketItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Your basket is empty</h3>
                <p className="text-sm text-muted-foreground">
                  Browse items and add them to your basket to start swapping!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {basketItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
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
                        <Badge variant="secondary" className="text-xs">
                          <Coins className="w-3 h-3 mr-1" />
                          {item.pointsCost}
                        </Badge>
                        {item.quantity > 1 && (
                          <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromBasket(item.id)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {basketItems.length > 0 && (
            <>
              <Separator />
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Points Required:</span>
                  <Badge variant={canAfford ? "default" : "destructive"}>
                    <Coins className="w-3 h-3 mr-1" />
                    {totalPoints}
                  </Badge>
                </div>

                {user && (
                  <div className="flex justify-between items-center text-sm">
                    <span>Your Points:</span>
                    <span className={canAfford ? "text-green-600" : "text-red-600"}>{userPoints}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Button className="w-full" onClick={handleProceedToSwap} disabled={!canAfford}>
                    Proceed to Swap
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={clearBasket}>
                    Clear Basket
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
