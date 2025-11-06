'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { productService } from '@/services/product.service';
import { TokenTimer } from '@/components/TokenTimer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/types';

export default function ProductsPage() {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [productDetails, setProductDetails] = useState<Map<number, Product>>(new Map());
  const [loadingDetails, setLoadingDetails] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleCard = async (id: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);

        // Si no tenemos los detalles, cargarlos
        if (!productDetails.has(id)) {
          setLoadingDetails((prev) => new Set(prev).add(id));

          productService
            .getById(id)
            .then((details) => {
              setProductDetails((prev) => {
                const newMap = new Map(prev);
                newMap.set(id, details);
                return newMap;
              });
            })
            .catch(() => {
              setError('Error al cargar los detalles del producto');
            })
            .finally(() => {
              setLoadingDetails((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
              });
            });
        }
      }

      return newSet;
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                  ← Volver al Dashboard
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <TokenTimer />
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-screen bg-gray-50 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Productos</h1>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const isExpanded = expandedCards.has(product.id);
                  const details = productDetails.get(product.id);
                  const isLoadingDetail = loadingDetails.has(product.id);

                  return (
                    <Card key={product.id} className="flex flex-col self-start">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 capitalize">
                          {product.type}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex flex-col gap-4 flex-1">
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                                {isLoadingDetail ? (
                                  <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                  </div>
                                ) : details ? (
                                  <>
                                    <p className="text-sm font-medium text-gray-700">Detalles:</p>
                                    <p className="text-sm text-gray-600">ID: {details.id}</p>
                                    <p className="text-sm text-gray-600">Nombre: {details.name}</p>
                                    <p className="text-sm text-gray-600">
                                      Tipo: <span className="capitalize">{details.type}</span>
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-sm text-red-600">Error al cargar los detalles</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Button
                          onClick={() => toggleCard(product.id)}
                          className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isLoadingDetail}
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
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
