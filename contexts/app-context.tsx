"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import { getDatabase, ref, get } from "firebase/database"

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  points: number;
  location: {
    city: string;
    state: string;
    country: string;
  };
  trustMetrics: {
    swapSuccessRate: number;
    totalSwaps: number;
    rating: number;
  };
  isAdmin?: boolean;
  isNGO?: boolean;
}

interface ProductSpecifications {
  brand?: string;
  material?: string;
  color: string;
  pattern?: string;
  sleeve?: string;
  neckline?: string;
  fit?: string;
  occasion?: string;
  season?: string;
  careInstructions?: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  specifications: ProductSpecifications;
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar: string;
  uploaderLocation: {
    city: string;
    state: string;
  };
  pointsCost: number;
  status: "available" | "reserved" | "swapped" | "pending";
  createdAt: string;
  isNGODonation?: boolean;
}

interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  targetItemId: string;
  targetItemTitle: string;
  offeredItems: string[];
  offeredItemTitles: string[];
  pointsDifference: number;
  message: string;
  status:
    | "proposed"
    | "accepted"
    | "rejected"
    | "shipped"
    | "delivered"
    | "completed";
  createdAt: string;
  updatedAt: string;
  chatMessages: ChatMessage[];
  shippingDetails?: {
    requesterAddress?: string;
    targetUserAddress?: string;
    trackingNumber?: string;
  };
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: "text" | "system";
}

interface BasketItem extends Item {
  quantity: number;
}

interface CategoryPoints {
  [key: string]: number;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  items: Item[];
  basketItems: BasketItem[];
  swapRequests: SwapRequest[];
  categoryPoints: CategoryPoints;
  addToBasket: (item: Item) => void;
  removeFromBasket: (itemId: string) => void;
  clearBasket: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<boolean>;
  createSwapRequest: (
    targetItemId: string,
    offeredItems: string[],
    message: string
  ) => void;
  updateSwapRequestStatus: (requestId: string, status: string) => void;
  sendChatMessage: (requestId: string, message: string) => void;
  updateCategoryPoints: (category: string, points: number) => void;
  createRedeemRequest: (itemId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data with enhanced specifications
const mockCategoryPoints: CategoryPoints = {
  Denim: 400,
  Shirts: 250,
  Kurti: 200,
  Trousers: 260,
  "T-Shirts": 150,
  Kidswear: 100,
  Dresses: 300,
  Outerwear: 350,
  Shoes: 200,
  Accessories: 100,
};

const mockItems: Item[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    description:
      "Classic blue denim jacket in excellent condition. Perfect for layering. Features vintage wash and classic fit.",
    category: "Denim",
    type: "Jacket",
    size: "M",
    condition: "Excellent",
    tags: ["vintage", "denim", "casual", "blue"],
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    specifications: {
      brand: "Levi's",
      material: "100% Cotton Denim",
      color: "Classic Blue",
      pattern: "Solid",
      fit: "Regular Fit",
      occasion: "Casual",
      season: "All Season",
      careInstructions: "Machine wash cold, tumble dry low",
    },
    uploaderId: "user2",
    uploaderName: "Sarah Chen",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    uploaderLocation: { city: "Mumbai", state: "Maharashtra" },
    pointsCost: 400,
    status: "available",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Floral Summer Kurti",
    description:
      "Beautiful floral print kurti, perfect for summer occasions. Comfortable cotton fabric with elegant design.",
    category: "Kurti",
    type: "Casual Kurti",
    size: "S",
    condition: "Good",
    tags: ["floral", "summer", "casual", "cotton"],
    images: ["/placeholder.svg?height=400&width=400"],
    specifications: {
      brand: "Fabindia",
      material: "100% Cotton",
      color: "Pink Floral",
      pattern: "Floral Print",
      sleeve: "3/4 Sleeve",
      neckline: "Round Neck",
      fit: "Regular Fit",
      occasion: "Casual, Festive",
      season: "Summer",
      careInstructions: "Hand wash recommended",
    },
    uploaderId: "user3",
    uploaderName: "Emma Wilson",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    uploaderLocation: { city: "Delhi", state: "Delhi" },
    pointsCost: 200,
    status: "available",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Designer Cotton Shirt",
    description:
      "Premium cotton shirt from a luxury brand. Perfect for office wear and formal occasions.",
    category: "Shirts",
    type: "Formal Shirt",
    size: "L",
    condition: "Like New",
    tags: ["designer", "cotton", "formal", "white"],
    images: ["/placeholder.svg?height=400&width=400"],
    specifications: {
      brand: "Van Heusen",
      material: "100% Cotton",
      color: "White",
      pattern: "Solid",
      sleeve: "Full Sleeve",
      neckline: "Collar",
      fit: "Slim Fit",
      occasion: "Formal, Business",
      season: "All Season",
      careInstructions: "Dry clean recommended",
    },
    uploaderId: "user4",
    uploaderName: "Michael Brown",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    uploaderLocation: { city: "Bangalore", state: "Karnataka" },
    pointsCost: 250,
    status: "available",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Casual Cotton T-Shirt",
    description:
      "Comfortable cotton t-shirt in navy blue. Perfect for everyday wear.",
    category: "T-Shirts",
    type: "Casual T-Shirt",
    size: "M",
    condition: "Good",
    tags: ["cotton", "casual", "basic", "navy"],
    images: ["/placeholder.svg?height=400&width=400"],
    specifications: {
      brand: "H&M",
      material: "100% Cotton",
      color: "Navy Blue",
      pattern: "Solid",
      sleeve: "Short Sleeve",
      neckline: "Round Neck",
      fit: "Regular Fit",
      occasion: "Casual",
      season: "All Season",
      careInstructions: "Machine wash cold",
    },
    uploaderId: "user1",
    uploaderName: "John Doe",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    uploaderLocation: { city: "Mumbai", state: "Maharashtra" },
    pointsCost: 150,
    status: "pending",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    title: "Kids Rainbow Dress",
    description:
      "Colorful rainbow dress for kids. Perfect for parties and special occasions.",
    category: "Kidswear",
    type: "Party Dress",
    size: "4-5 Years",
    condition: "Excellent",
    tags: ["kids", "colorful", "party", "dress"],
    images: ["/placeholder.svg?height=400&width=400"],
    specifications: {
      brand: "Mothercare",
      material: "Cotton Blend",
      color: "Rainbow Multi",
      pattern: "Rainbow Stripes",
      sleeve: "Short Sleeve",
      fit: "Regular Fit",
      occasion: "Party, Casual",
      season: "Summer",
      careInstructions: "Machine wash gentle",
    },
    uploaderId: "user5",
    uploaderName: "Priya Sharma",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    uploaderLocation: { city: "Chennai", state: "Tamil Nadu" },
    pointsCost: 100,
    status: "available",
    createdAt: "2024-01-11",
    isNGODonation: true,
  },
];

const mockUser: User = {
  id: "user1",
  username: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
  bio: "Sustainable fashion enthusiast",
  points: 850,
  location: {
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
  },
  trustMetrics: {
    swapSuccessRate: 95,
    totalSwaps: 12,
    rating: 4.8,
  },
  isAdmin: true,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [items] = useState<Item[]>(mockItems);
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [categoryPoints, setCategoryPoints] =
    useState<CategoryPoints>(mockCategoryPoints);
  const fbUser: any = useUser();

 const [realUser, setRealUser] = useState<User | null>(null)

useEffect(() => {
  const fetchUserData = async () => {
    if (!fbUser?.user?.uid) return;

    const db = getDatabase();
    const userRef = ref(db, `/UserData/${fbUser.user.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const data = snapshot.val();

      const userFromDb: User = {
        id: fbUser.user.uid,
        username: data.name || "Unknown",
        email: data.email || "",
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "Sustainable fashion enthusiast",
        points: data.points || 100,
        location: {
          city: data.personalInfo?.city || "",
          state: data.personalInfo?.state || "",
          country: data.personalInfo?.country || "",
        },
        trustMetrics: {
          swapSuccessRate: 95,
          totalSwaps: 12,
          rating: 4.8,
        },
        isAdmin: data?.isAdmin || false,
      }

      setUser(userFromDb); // ✅ set user here, once
    }
  }

  fetchUserData();
}, [fbUser?.user?.uid]);



useEffect(() => {
  if (fbUser && realUser) {
    setUser(realUser)
  }
}, [fbUser])


  const addToBasket = (item: Item) => {
    setBasketItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromBasket = (itemId: string) => {
    setBasketItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearBasket = () => {
    setBasketItems([]);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password) {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    clearBasket();
    setSwapRequests([]);
  };

  const signup = async (
    email: string,
    password: string,
    username: string
  ): Promise<boolean> => {
    if (email && password && username) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        email,
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "New to ReWear!",
        points: 50,
        location: {
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
        },
        trustMetrics: {
          swapSuccessRate: 0,
          totalSwaps: 0,
          rating: 0,
        },
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const createSwapRequest = (
    targetItemId: string,
    offeredItems: string[],
    message: string
  ) => {
    if (!user) return;

    const targetItem = items.find((item) => item.id === targetItemId);
    const offeredItemDetails = items.filter((item) =>
      offeredItems.includes(item.id)
    );

    if (!targetItem) return;

    const offeredPointsValue = offeredItemDetails.reduce(
      (sum, item) => sum + item.pointsCost,
      0
    );
    const pointsDifference = targetItem.pointsCost - offeredPointsValue;

    const newRequest: SwapRequest = {
      id: `swap_${Date.now()}`,
      requesterId: user.id,
      requesterName: user.username,
      requesterAvatar: user.avatar,
      targetItemId,
      targetItemTitle: targetItem.title,
      offeredItems,
      offeredItemTitles: offeredItemDetails.map((item) => item.title),
      pointsDifference,
      message,
      status: "proposed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chatMessages: [
        {
          id: `msg_${Date.now()}`,
          senderId: user.id,
          senderName: user.username,
          message,
          timestamp: new Date().toISOString(),
          type: "text",
        },
      ],
    };

    setSwapRequests((prev) => [...prev, newRequest]);
  };

  const updateSwapRequestStatus = (requestId: string, status: string) => {
    setSwapRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: status as any,
              updatedAt: new Date().toISOString(),
            }
          : request
      )
    );
  };

  const sendChatMessage = (requestId: string, message: string) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.username,
      message,
      timestamp: new Date().toISOString(),
      type: "text",
    };

    setSwapRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              chatMessages: [...request.chatMessages, newMessage],
              updatedAt: new Date().toISOString(),
            }
          : request
      )
    );
  };

  const updateCategoryPoints = (category: string, points: number) => {
    setCategoryPoints((prev) => ({ ...prev, [category]: points }));
  };

  const createRedeemRequest = (itemId: string) => {
    // Mock redeem request - in real app would call API
    console.log(`Redeem request created for item ${itemId}`);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        items,
        basketItems,
        swapRequests,
        categoryPoints,
        addToBasket,
        removeFromBasket,
        clearBasket,
        isAuthenticated: !!fbUser,
        login,
        logout,
        signup,
        createSwapRequest,
        updateSwapRequestStatus,
        sendChatMessage,
        updateCategoryPoints,
        createRedeemRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
