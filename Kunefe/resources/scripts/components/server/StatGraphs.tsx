import React, { useCallback, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js';
import { ServerContext } from '@/state/server';
import { bytesToMegabytes } from '@/helpers';
import merge from 'deepmerge';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { faMemory, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';

const chartDefaults = (ticks?: Chart.TickOptions | undefined): ChartConfiguration => ({
  type: 'line',
  options: {
    animation: {
      duration: 1,
    },
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        fontColor: "#fff",
        fontSize: 14,
      }
    },
    tooltips: {
      enabled: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      yAxes: [
        {
          position: "left",
          "id": "yAxisCPU",
          scaleLabel: {
            display: true,
            labelString: 'CPU (%)',
            fontColor: "#fff",
            fontSize: 14,
          },
          ticks: {
            beginAtZero: true,
            fontColor: "rgba(66, 245, 215, 1)",
            fontSize: 14,
            fontFamily: '"IBM Plex Mono", monospace',
            min: 0,
            maxTicksLimit: 5,
          }
        },
        {
          position: "right",
          "id": "yAxisRam",
          scaleLabel: {
            display: true,
            labelString: "RAM (MB)",
            fontColor: "#fff",
            fontSize: 14,
          },
          ticks: {
            beginAtZero: true,
            fontColor: "rgba(93,197,96,1)",
            fontSize: 14,
            fontFamily: '"IBM Plex Mono", monospace',
            min: 0,
            maxTicksLimit: 5,
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            fontColor: "#fff",
            fontSize: 14,
          },
          gridLines: {
            display: false,
          },
        }
      ],
    },
  },
  data: {
    labels: Array(11).fill(''),
    datasets: [
      {
        label: "CPU Usage",
        data: Array(11).fill(0),
        yAxisID: "yAxisCPU",
        backgroundColor: "rgba(66, 245, 215, 0.5)",
        borderColor: "rgba(66, 245, 215, 1)",
        pointBackgroundColor: "rgba(66, 245, 215, 1)",
        pointBorderColor: "rgba(0, 0, 0, 0)",
        pointRadius: 5,
      },
      {
        label: "RAM Usage",
        data: Array(11).fill(0),
        yAxisID: "yAxisRam",
        backgroundColor: "rgba(93, 197, 96, 0.5)",
        borderColor: "rgba(93, 197, 96,1)",
        pointBackgroundColor: "rgba(93, 197, 96, 1)",
        pointBorderColor: "rgba(0, 0, 0, 0)",
        pointRadius: 5,
      }
    ],
  },
});

export default () => {
  const status = ServerContext.useStoreState(state => state.status.value);
  const limits = ServerContext.useStoreState(state => state.server.data!.limits);

  const [statics, setStatics] = useState<Chart>();

  const statRef = useCallback<(node: HTMLCanvasElement | null) => void>(node => {
    if (!node) {
      return;
    }

    setStatics(
      new Chart(node.getContext('2d')!, chartDefaults({
        callback: (value) => `${value}Mb  `
      })),
    );
  }, []);

  useWebsocketEvent(SocketEvent.STATS, (data: string) => {
    let stats: any = {};
    try {
      stats = JSON.parse(data);
    } catch (e) {
      return;
    }

    if (statics ?.data.datasets) {
      const ramdata = statics ?.data.datasets[1].data;
      if (statics ?.options.scales ?.yAxes) {
        let ticks = statics ?.options.scales ?.yAxes[1].ticks;
        ticks!.suggestedMax = limits.memory;
      }
      ramdata ?.push(bytesToMegabytes(stats.memory_bytes));
      ramdata ?.shift();

      const cpudata = statics ?.data.datasets[0].data;

      cpudata ?.push(stats.cpu_absolute);
      cpudata ?.shift();

      statics.update({ lazy: true });
    }
  });

  return (
    <div className="row">
      <div className="graphContainer">
        <div className="card">
          <div className="card-header">
            <h3 css={tw`mb-0 text-white`}>Resource Usage</h3>
          </div>
          <div className="card-body">
            <canvas
              id={'memory_chart'}
              ref={statRef}
              aria-label={'Server statistics'}
              role={'img'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
