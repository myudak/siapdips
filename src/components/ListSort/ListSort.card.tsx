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
} from "lucide-react";

export const cardComponents = {
  NavigationCard,
  Ipkstatus,
  Themecard,
  HidePopupcard,
  QuoteCard,
  TodoList,
  AutopbmCard,
  AutoLearnSocial,
  JadwalCard,
} as const;

export const cardComponentsOption: {
  [key: string]: [string, LucideIcon];
} = {
  NavigationCard: ["Navigation Card", Navigation],
  Ipkstatus: ["IPK Status", BarChart],
  Themecard: ["Theme Card", Palette],
  HidePopupcard: ["Lainnya", MoreHorizontal],
  QuoteCard: ["Quotes", Quote],
  TodoList: ["Todo List", CheckSquare],
  AutopbmCard: ["PBM Auto", Calendar],
  AutoLearnSocial: ["Auto Learn Social", LeafyGreen],
  JadwalCard: ["Jadwal Card", ScanHeart],
};

export type CardComponentsType = typeof cardComponents;
