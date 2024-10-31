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

export default function EquipmentDetailsWidgetChart({ data, isPerHourUsage }: WidgetProps) {
  const [filterDays, setFilterDays] = useState(15);

  const variableData = useMemo(() => {
    return data?.find((item) => item)?.result || [];
  }, [data]) as any;

  const dailyConsumption = variableData?.filter((item) => item?.variable === "daily_consumption") || [];
  const perHourUsage = variableData?.filter((item) => item?.variable === "perhourusage") || [];

  // Dados de consumo diário formatados com timestamps
  const mockDataDailyConsumption = dailyConsumption.map((item) => {
    return {
      time: moment(item?.time).valueOf(),
      value: item.value,
    };
  });

  // Agrupar e somar os valores por dia para consumo por hora
  const dailySums = perHourUsage.reduce((acc: Record<string, number>, item: any) => {
    const day = moment(item.time).format("YYYY-MM-DD");
    acc[day] = (acc[day] || 0) + item.value;
    return acc;
  }, {});

  // Formata os dados para o gráfico, transformando o objeto `dailySums` em um array com timestamps
  const formattedDailyData = Object.keys(dailySums).map((day) => ({
    time: new Date(day).getTime(),
    value: dailySums[day] / 100,
  }));

  // Calcula os limites do eixo X com base no filtro
  const minDate = filterDays
    ? moment().subtract(filterDays, "days").startOf("day").valueOf()
    : Math.min(...[...mockDataDailyConsumption, ...formattedDailyData].map((item) => item.time)); // Mostra desde o primeiro registro disponível quando não há filtro
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
      categories: isPerHourUsage
        ? formattedDailyData.map((item) => item.time) // Agrupado por dia em timestamps
        : mockDataDailyConsumption.map((item) => item.time), // Consumo direto em timestamps
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
      name: isPerHourUsage ? "Consumo por Dia" : "Consumo Direto",
      data: isPerHourUsage
        ? formattedDailyData.map((item) => ({ x: item.time, y: item.value }))
        : mockDataDailyConsumption.map((item) => ({ x: item.time, y: item.value })),
    },
  ];

  // Função para alterar o filtro de dias
  const handleFilterChange = (days) => {
    setFilterDays(days);
  };
  return (
    <Box width="100%" height="400px">
      <Box display="flex" justifyContent="center" mb={1} mt={1}>
        <ButtonGroup variant="outlined" color="primary">
          <Button onClick={() => handleFilterChange(null)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            TODO O PERÍODO
          </Button>
          <Button onClick={() => handleFilterChange(90)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            1 ANO
          </Button>
          <Button onClick={() => handleFilterChange(90)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            6 MESES
          </Button>
          <Button onClick={() => handleFilterChange(30)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            1 MÊS
          </Button>
          <Button onClick={() => handleFilterChange(15)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            15 DIAS
          </Button>
        </ButtonGroup>
      </Box>

      <Chart options={options} series={series} type="bar" height="350" />
    </Box>
  );
}
