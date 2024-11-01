"use server";

import { api } from "@/lib/api";
import { couponSchema } from "@/lib/zod";

export async function getCouponCode(data: {
  couponcode: string;
  slug: string;
}) {
  try {
    const res = await api(couponSchema, {
      method: "post",
      url: `/coupon/validate`,
      data,
    });

    console.log(res);

    return res;
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { status: false, message: "Error creating ticket", data: null };
  }
}
