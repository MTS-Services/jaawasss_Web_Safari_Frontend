"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Supplier } from "@/lib/data/suppliers"
import { Product } from "@/lib/data/products"

interface SavedSupplier {
  id: string
  name: string
  slug: string
  industry: string
  location: string
  rating: number
  reviewCount: number
  reviewed: boolean
  savedAt: string
}

interface SavedProduct {
  id: string
  name: string
  slug: string
  supplier: string
  supplierSlug: string
  price: string
  moq: string
  savedAt: string
}

interface FavoritesContextType {
  savedSuppliers: SavedSupplier[]
  savedProducts: SavedProduct[]
  compareList: string[] // supplier IDs
  addSupplierToFavorites: (supplier: Supplier) => void
  removeSupplierFromFavorites: (supplierId: string) => void
  isSupplierSaved: (supplierId: string) => boolean
  addProductToFavorites: (product: Product) => void
  removeProductFromFavorites: (productId: string) => void
  isProductSaved: (productId: string) => boolean
  addToCompare: (supplierId: string) => boolean
  removeFromCompare: (supplierId: string) => void
  isInCompare: (supplierId: string) => boolean
  clearCompareList: () => void
  compareCount: number
  maxCompare: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const MAX_COMPARE = 4

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [savedSuppliers, setSavedSuppliers] = useState<SavedSupplier[]>([])
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const storedSuppliers = localStorage.getItem("sourcenest_saved_suppliers")
    const storedProducts = localStorage.getItem("sourcenest_saved_products")
    const storedCompare = localStorage.getItem("sourcenest_compare_list")
    
    if (storedSuppliers) {
      try {
        setSavedSuppliers(JSON.parse(storedSuppliers))
      } catch (e) {
        console.error("Failed to parse saved suppliers", e)
      }
    }
    
    if (storedProducts) {
      try {
        setSavedProducts(JSON.parse(storedProducts))
      } catch (e) {
        console.error("Failed to parse saved products", e)
      }
    }
    
    if (storedCompare) {
      try {
        setCompareList(JSON.parse(storedCompare))
      } catch (e) {
        console.error("Failed to parse compare list", e)
      }
    }
    
    setIsInitialized(true)
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("sourcenest_saved_suppliers", JSON.stringify(savedSuppliers))
    }
  }, [savedSuppliers, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("sourcenest_saved_products", JSON.stringify(savedProducts))
    }
  }, [savedProducts, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("sourcenest_compare_list", JSON.stringify(compareList))
    }
  }, [compareList, isInitialized])

  const addSupplierToFavorites = (supplier: Supplier) => {
    if (!savedSuppliers.some(s => s.id === supplier.id)) {
      const newSaved: SavedSupplier = {
        id: supplier.id,
        name: supplier.name,
        slug: supplier.slug,
        industry: supplier.industry,
        location: `${supplier.location.city}, ${supplier.location.country}`,
        rating: supplier.rating,
        reviewCount: supplier.reviewCount,
        reviewed: supplier.reviewed,
        savedAt: new Date().toISOString()
      }
      setSavedSuppliers(prev => [newSaved, ...prev])
    }
  }

  const removeSupplierFromFavorites = (supplierId: string) => {
    setSavedSuppliers(prev => prev.filter(s => s.id !== supplierId))
  }

  const isSupplierSaved = (supplierId: string) => {
    return savedSuppliers.some(s => s.id === supplierId)
  }

  const addProductToFavorites = (product: Product) => {
    if (!savedProducts.some(p => p.id === product.id)) {
      const newSaved: SavedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        supplier: product.supplierName,
        supplierSlug: product.supplierSlug,
        price: product.priceRange,
        moq: product.moq,
        savedAt: new Date().toISOString()
      }
      setSavedProducts(prev => [newSaved, ...prev])
    }
  }

  const removeProductFromFavorites = (productId: string) => {
    setSavedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const isProductSaved = (productId: string) => {
    return savedProducts.some(p => p.id === productId)
  }

  const addToCompare = (supplierId: string): boolean => {
    if (compareList.length >= MAX_COMPARE) {
      return false
    }
    if (!compareList.includes(supplierId)) {
      setCompareList(prev => [...prev, supplierId])
    }
    return true
  }

  const removeFromCompare = (supplierId: string) => {
    setCompareList(prev => prev.filter(id => id !== supplierId))
  }

  const isInCompare = (supplierId: string) => {
    return compareList.includes(supplierId)
  }

  const clearCompareList = () => {
    setCompareList([])
  }

  return (
    <FavoritesContext.Provider value={{
      savedSuppliers,
      savedProducts,
      compareList,
      addSupplierToFavorites,
      removeSupplierFromFavorites,
      isSupplierSaved,
      addProductToFavorites,
      removeProductFromFavorites,
      isProductSaved,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompareList,
      compareCount: compareList.length,
      maxCompare: MAX_COMPARE
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
