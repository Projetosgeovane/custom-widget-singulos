import { Box } from "@mui/material";

import "./Widget.css";
import EquipmentDetailsWidgetChart from "./components/barChart";

type WidgetProps = {
  /**
   * Widget's data resolved from the API according to the widget's configuration.
   *
   * Will be `null` while loading or if somehow the communication with Admin/RUN has failed.
   */
  data: WidgetData[] | null;
  /**
   * Widget's parameter object.
   *
   * Will be `null` while loading or if somehow the communication with Admin/RUN has failed.
   */
  showTime: string | null;
  /**
   * Widget's parameter object.
   *
   * Will be `null` while loading or if somehow the communication with Admin/RUN has failed.
   */
  userSettings: TUserInformation | null;

  /**
   * Widget's parameter object.
   *
   * Will be `null` while loading or if somehow the communication with Admin/RUN has failed.
   */
  isPerHourUsage: any;
};

function Widget(props: WidgetProps) {
  const { data, showTime, userSettings, isPerHourUsage } = props;

  //   const gaugeData = variableData.map((item, index) => {
  //     const hours = time_format === "24" ? "HH" : "hh";
  //     const amPm = time_format === "24" ? "" : "a";

  //     const dateLuxonFormat = date_format?.replace("DD", "dd").replace("YYYY", "yyyy") + " " + hours + ":mm:ss " + amPm;
  //     const luxonTime = DateTime.fromISO(item.time).toFormat(dateLuxonFormat);
  //     const date = luxonTime.substring(0, 11);
  //     const time = luxonTime.substring(11);

  //     return {
  //       value: item.value as number,
  //       name: `${item.variable} - ${date}${showTime === "enable" ? `- ${time}` : ""}`,
  //       title: {
  //         offsetCenter: ["-155%", `${-103 + index * 30}%`],
  //       },
  //       detail: {
  //         valueAnimation: true,
  //         offsetCenter: ["-155%", `${-90 + index * 30}%`],
  //       },
  //     };
  //   });

  //   if (chartRef.current) {
  //     const chart = echarts.init(chartRef.current);
  //     chartInstance.current = chart;
  //     const options: EChartsOption = {
  //       series: [
  //         {
  //           type: "gauge",
  //           startAngle: 90,
  //           endAngle: -270,
  //           pointer: {
  //             show: false,
  //           },
  //           progress: {
  //             show: true,
  //             overlap: false,
  //             roundCap: true,
  //             clip: false,
  //             itemStyle: {
  //               borderWidth: 1,
  //               borderColor: "#464646",
  //             },
  //           },
  //           axisLine: {
  //             lineStyle: {
  //               width: 40,
  //             },
  //           },
  //           splitLine: {
  //             show: false,
  //             distance: 0,
  //             length: 10,
  //           },
  //           axisTick: {
  //             show: false,
  //           },
  //           axisLabel: {
  //             show: false,
  //             distance: 50,
  //           },
  //           data: gaugeData,
  //           title: {
  //             fontSize: 14,
  //           },
  //           detail: {
  //             width: 50,
  //             height: 14,
  //             fontSize: 14,
  //             color: "inherit",
  //             borderColor: "inherit",
  //             borderRadius: 20,
  //             borderWidth: 1,
  //             formatter: "{value}",
  //           },
  //         },
  //       ],
  //     };

  //     chart.setOption(options);

  //     const handleResize = () => {
  //       chart.resize();
  //     };

  //     window.addEventListener("resize", handleResize);

  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   }
  // }, [data, chartRef, variableData, time_format, date_format, showTime]);

  // if (!data) {
  //   return (
  //     <div className="container">
  //       <span>Loading...</span>
  //     </div>
  //   );
  // }

  //Gauge Chart
  return (
    <Box width={"100%"} height="300px">
      <EquipmentDetailsWidgetChart data={data} isPerHourUsage={isPerHourUsage} />
    </Box>
  );
}

export { Widget };
export type { WidgetProps };
