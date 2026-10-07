"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SORT_FIELDS,
  SearchQuerySchema,
  defaultQuery,
} from "@/app/lib/products";
import type { SearchQuery } from "@/app/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} className="flex flex-wrap gap-4 items-end">
      {/* คำค้น */}
      <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
        <label htmlFor="q" className="text-xs font-medium text-gray-600">คำค้น</label>
        <input
          id="q"
          {...register("q")}
          placeholder="เช่น phone, shirt..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* จำนวนรายการ */}
      <div className="flex flex-col gap-1 w-36">
        <label htmlFor="limit" className="text-xs font-medium text-gray-600">จำนวนรายการ</label>
        <input
          id="limit"
          type="number"
          required
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={!!errors.limit}
          aria-describedby="limit-error"
          className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.limit ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.limit && (
          <span id="limit-error" role="alert" className="text-xs text-red-500">
            {errors.limit.message}
          </span>
        )}
      </div>

      {/* เรียงตาม */}
      <div className="flex flex-col gap-1 w-36">
        <label htmlFor="sortBy" className="text-xs font-medium text-gray-600">เรียงตาม</label>
        <select
          id="sortBy"
          {...register("sortBy")}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      {/* ปุ่มค้นหา */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
      >
        {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
      </button>
    </form>
  );
}
