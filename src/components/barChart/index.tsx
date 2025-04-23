import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import moment from "moment-timezone";
import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type WidgetProps = {
  data: WidgetData[] | null;
  showTime: string | null;
  userSettings: TUserInformation | null;
  isPerHourUsage: any;
};

interface DataItem {
  variable: string;
  time: string;
  value: number;
}

export default function EquipmentDetailsWidgetChart({ data }: WidgetProps) {
  const [filterDays, setFilterDays] = useState(15);
  const [viewMode, setViewMode] = useState("daily");

  // Ajusta o filtro padrão quando o modo de visualização muda
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    setFilterDays(mode === "hourly" ? 7 : 15);
  };

  const variableData = useMemo(() => {
    return data?.find((item) => item)?.result || [];
  }, [data]) as DataItem[];

  // Filtra duplicatas mantendo apenas o primeiro registro para cada timestamp
  const perHourUsage = useMemo(() => {
    const uniqueTimestamps = new Map<number, DataItem>();

    const hourUsageData = variableData.filter((item) => item.variable === "perhourusage");

    // Aplica o filtro de dias tanto para modo diário quanto horário
    const filteredData = filterDays
      ? hourUsageData.filter((item) =>
        moment(item.time).isAfter(moment().subtract(filterDays, "days"))
      )
      : hourUsageData;

    filteredData.forEach((item) => {
      const timestamp = moment(item.time).valueOf();
      if (!uniqueTimestamps.has(timestamp)) {
        uniqueTimestamps.set(timestamp, item);
      }
    });

    return Array.from(uniqueTimestamps.values());
  }, [variableData, filterDays]);

  // Dados de consumo Horário formatados com timestamps
  const mockDataPerHourUsage = perHourUsage.map((item) => ({
    time: moment(item.time).valueOf(),
    value: item.value / 100,
  }));

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
    : Math.min(...[...mockDataPerHourUsage, ...formattedDailyData].map((item) => item.time)); // Mostra desde o primeiro registro disponível quando não há filtro
  const maxDate = moment().endOf("day").valueOf();

  const options = {
    chart: {
      type: "bar" as const,
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
      type: "datetime" as const,
      categories:
        viewMode === "daily"
          ? formattedDailyData.map((item) => item.time)
          : mockDataPerHourUsage.map((item) => item.time),
      min: minDate,
      max: maxDate,
    },
    tooltip: {
      x: {
        format: viewMode === "daily" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm",
      },
      y: {
        formatter: (value: number) => `${value}`,
      },
    },
    yaxis: {
      title: {
        text: viewMode === "hourly" ? "Consumo Horário (m³)" : "Consumo Diário (m³)",
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
      name: viewMode === "hourly" ? "Consumo Horário (m³)" : "Consumo Diário (m³)",
      data:
        viewMode === "daily"
          ? formattedDailyData.map((item) => ({ x: item.time, y: item.value }))
          : mockDataPerHourUsage.map((item) => ({ x: item.time, y: item.value })),
    },
  ];

  // Função para alterar o filtro de dias
  const handleFilterChange = (days) => {
    setFilterDays(days);
  };

  return (
    <Box width="100%" height="400px">
      <Box display="flex" justifyContent="space-between" alignItems="center" margin="10px 15px">
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, padding: 0 }}>
          <InputLabel id="view-mode-label">Visualização</InputLabel>
          <Select
            labelId="view-mode-label"
            value={viewMode}
            onChange={(e) => handleViewModeChange(e.target.value)}
            label="Visualização"
          >
            <MenuItem value="daily">Consumo Diário</MenuItem>
            <MenuItem value="hourly">Consumo Horário</MenuItem>
          </Select>
        </FormControl>

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
