"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/app/lib/products";
import type { Product, ProductDraft } from "@/app/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : { title: "", price: undefined, stock: undefined },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  const labelClass = "block text-xs font-medium text-gray-600 mb-1";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <form onSubmit={handleSubmit(saveProduct)} noValidate className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

      {/* ชื่อสินค้า */}
      <div>
        <label htmlFor="title" className={labelClass}>ชื่อสินค้า</label>
        <input
          id="title"
          required
          placeholder="เช่น iPhone 15"
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby="title-error"
          className={inputClass(!!errors.title)}
        />
        {errors.title && (
          <p id="title-error" role="alert" className={errorClass}>{errors.title.message}</p>
        )}
      </div>

      {/* ราคา */}
      <div>
        <label htmlFor="price" className={labelClass}>ราคา ($)</label>
        <input
          id="price"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          {...register("price", { valueAsNumber: true })}
          aria-invalid={!!errors.price}
          aria-describedby="price-error"
          className={inputClass(!!errors.price)}
        />
        {errors.price && (
          <p id="price-error" role="alert" className={errorClass}>{errors.price.message}</p>
        )}
      </div>

      {/* จำนวนคงเหลือ */}
      <div>
        <label htmlFor="stock" className={labelClass}>คงเหลือ</label>
        <input
          id="stock"
          type="number"
          required
          placeholder="0"
          {...register("stock", { valueAsNumber: true })}
          aria-invalid={!!errors.stock}
          aria-describedby="stock-error"
          className={inputClass(!!errors.stock)}
        />
        {errors.stock && (
          <p id="stock-error" role="alert" className={errorClass}>{errors.stock.message}</p>
        )}
      </div>

      {/* หมวดหมู่ */}
      <div>
        <label htmlFor="category" className={labelClass}>หมวดหมู่</label>
        <select
          id="category"
          {...register("category")}
          aria-invalid={!!errors.category}
          aria-describedby="category-error"
          className={`${inputClass(!!errors.category)} bg-white`}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p id="category-error" role="alert" className={errorClass}>{errors.category.message}</p>
        )}
      </div>

      {/* ปุ่ม */}
      <div className="sm:col-span-2 lg:col-span-4 flex gap-3 pt-1">
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {editing ? "💾 บันทึกการแก้ไข" : "➕ เพิ่มสินค้า"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 hover:bg-gray-100 text-gray-600 text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
