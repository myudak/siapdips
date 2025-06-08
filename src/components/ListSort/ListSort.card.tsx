import HidePopupcard from "@/components/HidePopupcard";
import Ipkstatus from "@/components/Ipkstatus";
import NavigationCard from "@/components/Navcard";
import QuoteCard from "@/components/Quotescard";
import Themecard from "@/components/Themecard";
import TodoList from "@/components/Todocard";
import AutopbmCard from "../AutopbmCard";
import { AutoLearnSocial } from "../AutoLearnSocial";
import JadwalCard from "../Jadwalcard";
import {
  Navigation,
  BarChart,
  Calendar,
  CheckSquare,
  MoreHorizontal,
  Palette,
  Quote,
  LeafyGreen,
  ScanHeart,
  LucideIcon,
  SaladIcon,
  QrCodeIcon,
} from "lucide-react";
import AutoFoodTruk from "../AutoFoodTruck";
import QrReader from "../QRCodeAbsen/QRCodeAbsen";

export const cardComponents = {
  NavigationCard,
  JadwalCard,
  Ipkstatus,
  Themecard,
  TodoList,
  QuoteCard,
  AutopbmCard,
  AutoLearnSocial,
  AutoFoodTruk,
  HidePopupcard, // Lainnya
  QrReader,
} as const;

export const cardComponentsOption: {
  [key: string]: [string, LucideIcon];
} = {
  NavigationCard: ["Navigation Card", Navigation],
  JadwalCard: ["Jadwal Card", ScanHeart],
  Ipkstatus: ["IPK Status", BarChart],
  Themecard: ["Theme Card", Palette],
  TodoList: ["Todo List", CheckSquare],
  QuoteCard: ["Quotes", Quote],
  AutopbmCard: ["PBM Auto", Calendar],
  AutoLearnSocial: ["Auto Learn Social {Helper}", LeafyGreen],
  AutoFoodTruk: ["Food Truk {Helper}", SaladIcon],
  HidePopupcard: ["Lainnya", MoreHorizontal], // etc
  QrReader: ["QR Code Reader", QrCodeIcon],
};

export type CardComponentsType = typeof cardComponents;
