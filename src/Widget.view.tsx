import { useState, useEffect } from "react";

import "@tago-io/custom-widget";
import "@tago-io/custom-widget/dist/custom-widget.css";

import { Widget } from "./Widget";

/**
 * Widget view component.
 *
 * Responsible for managing state and synchronizing the internal state for the custom widget's
 * data with TagoIO (Admin and RUN), and also for providing callbacks for the presentational
 * component to use the functions from the Custom Widget Library.
 *
 * This separation of concerns makes it easier to test the widget and leaving some state (e.g. UI state, etc.)
 * in the presentational component and its sub-components.
 */
function WidgetView() {
  const [showTime, setShowTime] = useState<string | null>(null);
  const [data, setData] = useState<WidgetData[] | null>(null);
  const [userSettings, setUserSettings] = useState<TUserInformation | null>(null);
  const [perHourUsage, setPerHourUsage] = useState<any>(null);

  useEffect(() => {
    // Start communication with TagoIO Admin/RUN.
    window.TagoIO.ready();

    // Receive the widget's configuration object when it's ready to start.
    window.TagoIO.onStart((widget) => {
      const parameters = widget?.display.parameters;
      const showTime = parameters?.find((e: { key: string; value: string }) => e.key === "show_time")?.value;
      setShowTime(showTime);
    });

    // Receive the widget's data and realtime data updates.
    // For more control over updating the state, the callback passed to `onRealtime` can check if
    // the data has changed before updating the state to avoid re-rendering unnecessarily.
    window.TagoIO.onRealtime((data) => {
      const isPerHourUsage = data?.[1]?.result?.[0]?.tags?.some((item) => item?.key === "is_per_hour_usage");
      setData(data);
      setPerHourUsage(isPerHourUsage);
    });
    // Receive the users data information.
    window.TagoIO.onSyncUserInformation((user: TUserInformation) => {
      if (user && !userSettings) {
        setUserSettings(user);
      }
    });
  }, [userSettings]);

  return <Widget showTime={showTime} data={data} userSettings={userSettings} isPerHourUsage={perHourUsage} />;
}

export { WidgetView };

/**
 * Get a variable from the widget's display variables by using the variable key (see `getVariableKey`) as identifier.
 *
 * @param variableKey Key from the options.
 *
 * @returns Variable object from the widget's display or `null` if it couldn't be found.
 */
