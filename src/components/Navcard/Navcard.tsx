import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavButton from "./Navcard.button";
import { navLinks } from "./Navcard.constant";

const NavigationCard = () => {
  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="py-2">
        <CardTitle className="text-lg font-bold">Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-1 p-2">
        {navLinks.map((link, index) => (
          <NavButton key={index} {...link} />
        ))}
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
