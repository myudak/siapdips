import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewTabDashboardSettingsEditor from "@/components/NewTabDashboardSettingsEditor";

const SettingcardNewTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Tab Dashboard</CardTitle>
        <CardDescription>
          Customize the new tab dashboard from here or directly inside the new tab page.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <NewTabDashboardSettingsEditor context="option" />
      </CardContent>
    </Card>
  );
};

export default SettingcardNewTab;
