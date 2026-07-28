import { PrismaClient } from "@prisma/client"
import ProductDetailsClient from "@/components/shop/ProductDetailsClient"

const prisma = new PrismaClient()

// Mock data fallback for hardcoded frontend links (m1, p1, etc)
const MOCK_PRODUCTS = [
  { id: "1", name: "iPhone 15 Pro Max", price: 159900, category: "Mobiles", brand: "Apple", stock: 12, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop", description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever." },
  { id: "2", name: "Samsung Galaxy S24 Ultra", price: 129999, category: "Mobiles", brand: "Samsung", stock: 8, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop", description: "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. It's an absolute marvel of design." },
  { id: "3", name: "Sony WH-1000XM5", price: 29990, category: "Accessories", brand: "Sony", stock: 15, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop", description: "Industry-leading noise cancellation headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours of battery life." },
  // Adding the Amazon-like mobiles mock data so clicking them works seamlessly
  { id: "m1", name: "Apple iPhone 15 (128 GB) - Black", price: 72999, category: "Mobiles", brand: "Apple", stock: 12, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop", description: "A16 Bionic chip with 5-core GPU, 48MP Main camera, Dynamic Island." },
  { id: "m2", name: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB Storage)", price: 129999, category: "Mobiles", brand: "Samsung", stock: 10, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop", description: "Snapdragon 8 Gen 3, 200MP Camera, S-Pen Included." },
  { id: "m3", name: "OnePlus 12R (Cool Blue, 8GB RAM, 128GB Storage)", price: 39999, category: "Mobiles", brand: "OnePlus", stock: 5, image: "https://images.unsplash.com/photo-1706606991536-e39841f5f50a?q=80&w=600&auto=format&fit=crop", description: "Snapdragon 8 Gen 2, 5500 mAh Battery, 100W SUPERVOOC." },
  { id: "m4", name: "Redmi 13C (Stardust Black, 4GB RAM, 128GB Storage)", price: 7999, category: "Mobiles", brand: "Xiaomi", stock: 20, image: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?q=80&w=600&auto=format&fit=crop", description: "MediaTek Helio G85, 50MP AI Triple Camera, 90Hz Display." },
  { id: "m5", name: "Nothing Phone (2) (White, 12GB RAM, 256GB Storage)", price: 44999, category: "Mobiles", brand: "Nothing", stock: 5, image: "https://images.unsplash.com/photo-1691440263529-65b7d6006f0e?q=80&w=600&auto=format&fit=crop", description: "Glyph Interface, Snapdragon 8+ Gen 1, 50MP Dual Camera." },
  // Adding Spare parts mock data
  { id: "p1", name: "iPhone 13 Original OLED Display", price: 12500, category: "Spare Parts", brand: "Apple", stock: 5, image: "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?q=80&w=600&auto=format&fit=crop", description: "Original OLED Display replacement for iPhone 13." },
]

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  let product = null;

  try {
    // 1. Try to fetch real product from Database
    const dbProduct = await prisma.product.findUnique({
      where: { id: id },
      include: {
        brand: true,
        category: true,
        variants: true
      }
    });

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.basePrice,
        category: dbProduct.category?.name || "Uncategorized",
        brand: dbProduct.brand?.name || "Unknown",
        type: dbProduct.type, // MOBILE, SPARE_PART, etc
        stock: dbProduct.variants?.[0]?.stock || 10,
        image: dbProduct.images || "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
        description: dbProduct.description || "No detailed description provided by the backend.",
        variants: dbProduct.variants
      };
    }
  } catch (error) {
    console.error("Error fetching product from DB:", error);
  }

  // 2. Fallback to Mock Data if not found in DB
  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
  }

  return <ProductDetailsClient product={product} />
}
