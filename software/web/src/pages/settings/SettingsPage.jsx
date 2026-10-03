import { useState } from "react";
import useSettings from "../../hooks/useSettings";
import SettingsSidebar from "./SettingsSidebar";
import AccountOverview from "./AccountOverview";
import ManagePlants from "./ManagePlants";
import ManageAccount from "./ManageAccount";
import "./Settings.css";

export default function SettingsPage() {
  // "overview" | "plants" | "account"
  const [section, setSection] = useState("overview");
  const { user, plants, updateProfile, updateTheme, changePassword } = useSettings();

  return (
    <div className="settings-page">
      <div className="settings-card">
        <SettingsSidebar user={user} active={section} onSelect={setSection} />

        <main className="settings-main">
          {section === "overview" && (
            <AccountOverview user={user} plants={plants} onNavigate={setSection} />
          )}
          {section === "plants" && <ManagePlants plants={plants} />}
          {section === "account" && (
            <ManageAccount
              user={user}
              onSaveProfile={updateProfile}
              onChangeTheme={updateTheme}
              onChangePassword={changePassword}
            />
          )}
        </main>
      </div>
    </div>
  );
}
