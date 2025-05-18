import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { withTranslation } from "react-i18next";

// import { API_URL } from '@/config/env';
import { API_URL } from "@/config/env";

class ChartOne extends Component {
  constructor(props) {
    super(props);

    const currentYear = new Date().getFullYear();

    this.state = {
      currentYear,
      series: [],
      options: {
        legend: {
          show: false,
          position: "top",
          horizontalAlign: "left",
        },
        colors: ["#3C50E0", "#80CAEE"],
        chart: {
          fontFamily: "Satoshi, sans-serif",
          height: 335,
          type: "area",
          dropShadow: {
            enabled: true,
            color: "#623CEA14",
            top: 10,
            blur: 4,
            left: 0,
            opacity: 0.1,
          },
          toolbar: {
            show: false,
          },
        },
        responsive: [
          {
            breakpoint: 1024,
            options: {
              chart: {
                height: 300,
              },
            },
          },
          {
            breakpoint: 1366,
            options: {
              chart: {
                height: 350,
              },
            },
          },
        ],
        stroke: {
          width: [2, 2],
          curve: "straight",
        },
        labels: {
          show: false,
          position: "top",
        },
        grid: {
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 4,
          colors: "#fff",
          strokeColors: ["#3056D3", "#80CAEE"],
          strokeWidth: 3,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          hover: {
            size: undefined,
            sizeOffset: 5,
          },
        },
        xaxis: {
          type: "category",
          categories: [],
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          title: {
            style: {
              fontSize: "0px",
            },
          },
          min: 0,
        },
      },
    };
  }

  async componentDidMount() {
    const { t } = this.props;
    const { currentYear } = this.state;

    try {
      const response = await fetch(
        `${API_URL}/chart-data/salary-by-gender?year=${currentYear}`
      );
      const data = await response.json();

      const translatedSeries = data.series.map((serie) => ({
        name: serie.name.toLowerCase().includes("laki")
          ? `${t("chartsOne.dataMale")} (${currentYear})`
          : `${t("chartsOne.dataFemale")} (${currentYear})`,
        data: serie.data,
      }));

      this.setState((prevState) => ({
        series: translatedSeries,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: data.labels,
          },
          yaxis: {
            ...prevState.options.yaxis,
            max: Math.max(...data.series.flatMap((s) => s.data)) * 1.2,
          },
        },
      }));
    } catch (error) {
      console.error("Error al cargar los datos del gráfico:", error);
    }
  }

  render() {
    const { t } = this.props;
    const { series, options } = this.state;

    return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
          <div className="flex w-full flex-wrap gap-3 sm:gap-5">
            <div className="flex min-w-47.5">
              <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
              </span>
              <div className="w-full">
                <p className="font-semibold text-primary">
                  {t("chartsOne.dataMale")}
                </p>
                <p className="text-sm font-medium">{this.state.currentYear}</p>
              </div>
            </div>
            <div className="flex min-w-47.5">
              <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
                <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
              </span>
              <div className="w-full">
                <p className="font-semibold text-secondary">
                  {t("chartsOne.dataFemale")}
                </p>
                <p className="text-sm font-medium">{this.state.currentYear}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div id="chartOne" className="-ml-5">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={350}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation("dashboard")(ChartOne);
