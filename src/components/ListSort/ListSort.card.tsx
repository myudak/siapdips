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
  LucideSchool2,
  SquareSplitHorizontal,
  BriefcaseBusinessIcon,
  ListChecks,
  GraduationCap,
} from "lucide-react";
import AutoFoodTruk from "../AutoFoodTruck";
import QrReader from "../QRCodeAbsen/QRCodeAbsen";
import MoodleCard from "../MoodleCard";
import SuspenderCard from "../SuspenderCard";
import JobTrackerCard from "../JobTrackerCard";
import TodoistSyncCard from "../TodoistSyncCard";
import OracleAcademyCard from "../OracleAcademyCard";

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
  MoodleCard,
  SuspenderCard,
  JobTrackerCard,
  TodoistSyncCard,
  OracleAcademyCard,
} as const;

export const cardComponentsOption: {
  [key: string]: [string, LucideIcon];
} = {
  NavigationCard: ["Navigation Card", Navigation],
  OracleAcademyCard: ["Oracle Academy Helper", GraduationCap],
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
  MoodleCard: ["Moodle Helper Settings", LucideSchool2],
  JobTrackerCard: ["Job Tracker", BriefcaseBusinessIcon],
  TodoistSyncCard: ["Todoist Sync", ListChecks],

  SuspenderCard: ["Suspend Card", SquareSplitHorizontal],
};

export type CardComponentsType = typeof cardComponents;
