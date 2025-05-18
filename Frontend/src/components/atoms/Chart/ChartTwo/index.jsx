import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { withTranslation } from "react-i18next";

// import { API_URL } from '@/config/env';
import { API_URL } from "@/config/env";

class ChartTwo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
      permanent: 0,
      temporary: 0,
      options: {
        chart: {
          fontFamily: "Satoshi, sans-serif",
          type: "donut",
        },
        colors: ["#3C50E0", "#0FADCF"],
        labels: [], // ← dinámico según idioma
        legend: {
          show: false,
          position: "bottom",
        },
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
              background: "transparent",
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        responsive: [
          {
            breakpoint: 2600,
            options: {
              chart: {
                width: 380,
              },
            },
          },
          {
            breakpoint: 640,
            options: {
              chart: {
                width: 200,
              },
            },
          },
        ],
      },
    };
  }

  fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/chart-data/employee-status`);
      const data = await res.json();

      const [permanent, temporary] = data.series;

      this.setState(
        {
          series: data.series,
          permanent,
          temporary,
        },
        this.updateLabels
      );
    } catch (error) {
      console.error("Error al cargar gráfico de empleados:", error);
    }
  };

  updateLabels = () => {
    const { t } = this.props;
    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        labels: [
          t("chartsTwo.labels.permanent"),
          t("chartsTwo.labels.temporary"),
        ],
      },
    }));
  };

  componentDidMount() {
    this.fetchData();

    // Suscribirse al cambio de idioma
    this.props.i18n.on("languageChanged", this.updateLabels);
  }

  componentWillUnmount() {
    // Limpiar listener al desmontar
    this.props.i18n.off("languageChanged", this.updateLabels);
  }

  render() {
    const { t } = this.props;
    const { options, series, permanent, temporary } = this.state;

    return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div>
            <h5 className="text-xl font-semibold text-black dark:text-white">
              {t("chartsTwo.title")}
            </h5>
          </div>
        </div>

        <div className="mb-2">
          <div id="chartTwo" className="mx-auto flex justify-center">
            <ReactApexChart options={options} series={series} type="donut" />
          </div>
        </div>

        <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
          <div className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{t("chartsTwo.labels.permanent")}</span>
                <span>{permanent}</span>
              </p>
            </div>
          </div>
          <div className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{t("chartsTwo.labels.temporary")}</span>
                <span>{temporary}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation("dashboard")(ChartTwo);
