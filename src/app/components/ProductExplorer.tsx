"use client";

import { useState } from "react";
import Image from "next/image";
import { defaultQuery, fetchProducts } from "@/app/lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/app/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductFrom";

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ",
    );
    setStatus("error");
  }

  function saveProduct(draft: ProductDraft) {
    setProducts([...products, { ...draft, id: Date.now(), thumbnail: "" }]);
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Product Explorer</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Search Form */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">🔍 ค้นหาสินค้า</h2>
          <ProductSearchForm onSearch={loadProducts} />
        </section>

        {/* Add Product Form */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">➕ เพิ่มสินค้า</h2>
          <ProductForm editing={null} onSave={saveProduct} onCancel={() => {}} />
        </section>

        {/* Results */}
        <section aria-live="polite">
          {status === "idle" && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🛍️</p>
              <p className="text-sm">กดค้นหาเพื่อดูรายการสินค้า</p>
            </div>
          )}

          {status === "loading" && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3 animate-bounce">⏳</p>
              <p className="text-sm">กำลังโหลดข้อมูล...</p>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {status === "ready" && products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
            </div>
          )}

          {status === "ready" && products.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-700">รายการสินค้า</h2>
                <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded-full">
                  {products.length} รายการ
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">รูปภาพ</th>
                      <th className="px-6 py-3">ชื่อสินค้า</th>
                      <th className="px-6 py-3">ราคา</th>
                      <th className="px-6 py-3">คงเหลือ</th>
                      <th className="px-6 py-3">หมวดหมู่</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {item.thumbnail ? (
                              <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                style={{ objectFit: "contain" }}
                                sizes="56px"
                                className="p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📦</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                          {item.title}
                        </td>
                        <td className="px-6 py-3 text-green-700 font-semibold">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.stock > 50
                              ? "bg-green-100 text-green-700"
                              : item.stock > 10
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                            {item.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
