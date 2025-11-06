"use client"

import { useState } from "react"
import { CreditCard, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Product {
  id: number
  name: string
  type: string
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Cuenta de Ahorros",
    type: "Savings",
    description: "Savings",
  },
  {
    id: 2,
    name: "Cuenta Corriente",
    type: "Checking",
    description: "Checking",
  },
  {
    id: 3,
    name: "Tarjeta de Crédito",
    type: "Credit",
    description: "Credit",
  },
]

export default function ProductsPage() {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())

  const toggleCard = (id: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Productos</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const isExpanded = expandedCards.has(product.id)

            return (
              <Card key={product.id} className="flex flex-col self-start">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{product.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 flex-1">
                  {isExpanded && (
                    <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Detalles:</p>
                      <p className="text-sm text-gray-600">ID: {product.id}</p>
                      <p className="text-sm text-gray-600">Nombre: {product.name}</p>
                      <p className="text-sm text-gray-600">Tipo: {product.type}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => toggleCard(product.id)}
                    className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isExpanded ? (
                      <>
                        Ocultar detalles
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Ver detalles
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
