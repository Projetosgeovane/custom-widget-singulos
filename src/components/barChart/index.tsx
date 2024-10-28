import { useMemo } from "react";
import Chart from "react-apexcharts";
import moment from "moment-timezone";
import { Box } from "@mui/material";

type WidgetProps = {
  data: WidgetData[] | null;
  showTime: string | null;
  userSettings: TUserInformation | null;
  isPerHourUsage: any;
};

export default function EquipmentDetailsWidgetChart({ data, isPerHourUsage }: WidgetProps) {
  const variableData = useMemo(() => {
    return data?.find((item) => item)?.result || [];
  }, [data]) as any;

  const dailyConsumption = variableData?.filter((item) => item?.variable === "daily_consumption") || [];
  const perHourUsage = variableData?.filter((item) => item?.variable === "perhourusage") || [];

  const mockDataPerHourUsage = perHourUsage.map((item) => {
    const timeMoment = moment(item?.time).format("yyyy-MM-dd HH:mm:ss");
    return {
      value: item.value,
      time: timeMoment, // Formata a hora usando Luxon
    };
  });

  const mockDataDailyConsumption = dailyConsumption.map((item) => {
    const timeMoment = moment(item?.time).format("yyyy-MM-dd HH:mm:ss");
    return {
      value: item.value,
      time: timeMoment, // Formata a hora usando Luxon
    };
  });

  const options = {
    chart: {
      type: "bar",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: 7,
      },
    },
    xaxis: {
      type: "datetime", // Necessário para reconhecer as datas corretamente
      categories: isPerHourUsage
        ? mockDataPerHourUsage.map((item) => item.time)
        : mockDataDailyConsumption.map((item) => item.time), // Valores formatados para o eixo X
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm", // Formatação para a tooltip
      },
      y: {
        formatter: (value: number) => `${value.toFixed(2)}`, // Formatação para os valores
      },
    },
    yaxis: {
      title: {
        text: "Usage",
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  // const series = [
  //   {
  //     name: "perhourusage",
  //     data: mockData.map((item) => item.value), // Valores formatados para o eixo Y
  //   },
  // ];
  const series = [
    {
      name: isPerHourUsage ? "perhourusage" : "daily_consumption",
      data: isPerHourUsage
        ? mockDataPerHourUsage.map((item) => item.value)
        : mockDataDailyConsumption.map((item) => item.value), // Valores formatados para o eixo Y
    },
  ];

  return (
    <Box width="100%" height="400px">
      <Chart options={options} series={series} type="bar" height="350" />
    </Box>
  );
}
