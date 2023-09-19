
import { random } from "@/lib/utils";
import { Card, Metric, Text, AreaChart, BadgeDelta, Flex, BarChart, Title, Subtitle } from "@tremor/react";

import { useMemo } from "react";

export default function OverviewStats() {
  const data = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return [
      ...months.map((month) => ({
        Month: `${month} 23`,
        "Components Refactored": random(8200, 11400),
      })),
      {
        Month: "Jul 23",
        "Components Refactored": 11400,
      },
    ];
  }, []);

  const barchartdata = [
    { name: "Jan 23",
      "refactored": 10,
      "built": 0,
      "tested": 0
    },
    { name: "Feb 23",
      "refactored": 40,
      "built": 10,
      "tested": 0
    },
    { name: "Mar 23",
      "refactored": 70,
      "built": 10,
      "tested": 0
    },
    { name: "Apr 23",
      "refactored": 80,
      "built": 40,
      "tested": 20
    },
    { name: "May 23",
      "refactored": 100,
      "built": 85,
      "tested": 60
    },
    { name: "Jun 23",
      "refactored": 100,
      "built": 100,
      "tested": 80
    },
    { name: "Jul 23",
      "refactored": 100,
      "built": 100,
      "tested": 90
    }
  ]

  const burndata = [
    { name: "Jan 23",
      "Agile Stories Remaining": 895     
    },
    { name: "Feb 23",
      "Agile Stories Remaining": 673 
    },
    { name: "Mar 23",
     "Agile Stories Remaining": 527 
    },
    { name: "Apr 23",
     "Agile Stories Remaining": 490 
    },
    { name: "May 23",
    "Agile Stories Remaining": 410 
    },
    { name: "Jun 23",
    "Agile Stories Remaining": 312 
    },
    { name: "Jul 23",
    "Agile Stories Remaining": 227 
    }
  ]

  const dataFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
  };

  return (
    <>
    <div className="grid gap-6 sm:grid-cols-3">
      <Card className="dark:!bg-stone-900">
        <Text color={"blue"}>Components Refactored</Text>
        <Flex
          className="space-x-3 truncate"
          justifyContent="start"
          alignItems="baseline"
        >
          <Metric className="font-cal">11,400</Metric>
          <BadgeDelta
            deltaType="moderateIncrease"
            className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
          >
            34.3%
          </BadgeDelta>
        </Flex>
        <AreaChart
          className="mt-6 h-28"
          data={data}
          index="Month"
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("us").format(number).toString()}`
          }
          categories={["Components Refactored"]}
          colors={["blue"]}
          showXAxis={true}
          showGridLines={false}
          startEndOnly={true}
          showYAxis={false}
          showLegend={false}
        />
      </Card>
  
    <Card className="dark:!bg-stone-900">
      <Text color={"blue"}>Modernization Progress</Text>
      <Subtitle color={"blue"}>
        Component Pipeline % through Testing 
      </Subtitle>
      
      <BarChart
        className="mt-6 h-28"
        data={barchartdata}
        index="name"
        valueFormatter={(number: number) =>
          `${Intl.NumberFormat("us").format(number).toString()}`
        }
        categories={["refactored", "built", "tested"]}
        colors={["blue", "teal", "amber"]}
        showXAxis={true}            
        yAxisWidth={48}
        showLegend={true}
        minValue={0}
        
        
      />
    </Card>
    <Card className="dark:!bg-stone-900">
        <Text color={"blue"}>Agile Burndown Chart</Text>
        <Subtitle color={"blue"}>
           Open User Stories by month
        </Subtitle>
        <BarChart
          className="mt-6 h-28"
          data={burndata}
          index="name"
          categories={["Agile Stories Remaining"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
        />
      </Card>
  </div>
  </>
  );
}
