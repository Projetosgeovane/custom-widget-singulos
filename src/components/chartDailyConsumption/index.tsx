import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import moment from "moment-timezone";
import { Box, Button, ButtonGroup } from "@mui/material";

type WidgetProps = {
  data: WidgetData[] | null;
  showTime: string | null;
  userSettings: TUserInformation | null;
  isPerHourUsage: any;
};

export default function DailyConsumptionWidgetChart({ data }: WidgetProps) {
  const [filterDays, setFilterDays] = useState(15);

  const variableData = useMemo(() => {
    return data?.find((item) => item)?.result || [];
  }, [data]) as any;

  const dailyConsumption = variableData?.filter((item) => item?.variable === "daily_consumption") || [];

  // Dados de consumo diário formatados com timestamps
  const mockDataDailyConsumption = dailyConsumption.map((item) => {
    return {
      time: moment(item?.time).valueOf(),
      value: item.value,
    };
  });

  // Calcula os limites do eixo X com base no filtro
  const minDate = filterDays
    ? moment().subtract(filterDays, "days").startOf("day").valueOf()
    : Math.min(...[...mockDataDailyConsumption].map((item) => item.time)); // Mostra desde o primeiro registro disponível quando não há filtro
  const maxDate = moment().endOf("day").valueOf();

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
        columnWidth: "60%",
      },
    },
    xaxis: {
      type: "datetime",
      categories: mockDataDailyConsumption.map((item) => item.time), // Consumo direto em timestamps
      min: minDate, // Define o limite mínimo com base no filtro
      max: maxDate,
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy",
      },
      y: {
        formatter: (value: number) => `${value}`,
      },
    },
    yaxis: {
      title: {
        text: "Consumo Diário (m³)",
      },
      min: 0,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  const series = [
    {
      name: "Consumo Diário (m³)",
      data: mockDataDailyConsumption.map((item) => ({ x: item.time, y: item.value })),
    },
  ];

  // Função para alterar o filtro de dias
  const handleFilterChange = (days) => {
    setFilterDays(days);
  };

  return (
    <Box width="100%" height="400px">
      <Box display="flex" justifyContent="center" alignItems="center" margin="10px 15px">
        <ButtonGroup variant="outlined" size="small" color="primary">
          <Button
            onClick={() => handleFilterChange(null)}
            sx={{ padding: "2px 30px", whiteSpace: "nowrap", fontSize: "0.75rem" }}
          >
            TODO PERÍODO
          </Button>
          <Button
            onClick={() => handleFilterChange(365)}
            sx={{ padding: "2px 6px", whiteSpace: "nowrap", fontSize: "0.75rem" }}
          >
            1 ANO
          </Button>
          <Button
            onClick={() => handleFilterChange(90)}
            sx={{ padding: "2px 6px", whiteSpace: "nowrap", fontSize: "0.75rem" }}
          >
            6 MESES
          </Button>
          <Button
            onClick={() => handleFilterChange(30)}
            sx={{ padding: "2px 6px", whiteSpace: "nowrap", fontSize: "0.75rem" }}
          >
            1 MÊS
          </Button>
          <Button
            onClick={() => handleFilterChange(15)}
            sx={{ padding: "2px 6px", whiteSpace: "nowrap", fontSize: "0.75rem" }}
          >
            15 dias
          </Button>
        </ButtonGroup>
      </Box>

      <Chart options={options} series={series} type="bar" height="350" />
    </Box>
  );
}
