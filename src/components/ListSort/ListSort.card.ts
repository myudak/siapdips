import HidePopupcard from "@/components/HidePopupcard";
import Ipkstatus from "@/components/Ipkstatus";
import NavigationCard from "@/components/Navcard";
import QuoteCard from "@/components/Quotescard";
import Themecard from "@/components/Themecard";
import TodoList from "@/components/Todocard";
import AutopbmCard from "../AutopbmCard";

export const cardComponents = {
  NavigationCard,
  Ipkstatus,
  Themecard,
  HidePopupcard,
  QuoteCard,
  TodoList,
  AutopbmCard,
} as const;

export type CardComponentsType = typeof cardComponents;
