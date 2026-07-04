import { Metadata } from "next";
import SpinWinContent from "./SpinWinContent";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Fortune Wheel | Spin & Win Vouchers",
  description: "Spin the Luxury Jewelry Fortune Wheel to win exclusive vouchers, discount coupons, and luxury benefits.",
  path: "/spin-win",
});

export default function SpinWinPage() {
  return <SpinWinContent />;
}
