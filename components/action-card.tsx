import React from 'react'
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
//import { Action, Project } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";
import CameraIcon from "@mui/icons-material/Camera"
import { blue, grey } from '@mui/material/colors';

const imageBlurhash = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAACXBIWXMAABYlAAAWJQFJUiTwAAABfUlEQVR4nN3XyZLDIAwE0Pz/v3q3r55JDlSBplsIEI49h76k4opexCK/juP4eXjOT149f2Tf9ySPgcjCc7kdpBTgDPKByKK2bTPFEdMO0RDrusJ0wLRBGCIuelmWJAjkgPGDSIQEMBDCfA2CEPM80+Qwl0JkNxBimiaYGOTUlXYI60YoehzHJDEm7kxjV3whOQTD3AaCuhGKHoYhyb+CBMwjIAFz647kTqyapdV4enGINuDJMSScPmijSwjCaHeLcT77C7EC0C1ugaCTi2HYfAZANgj6Z9A8xY5eiYghDMNQBJNCWhASot0jGsSCUiHWZcSGQjaWWCDaGMOWnsCcn2QhVkRuxqqNxMSdUSElCDbp1hbNOsa6Ugxh7xXauF4DyM1m5BLtCylBXgaxvPXVwEoOBjeIFVODtW74oj1yBQah3E8tyz3SkpolKS9Geo9YMD1QJR1Go4oJkgO1pgbNZq0AOUPChyjvh7vlXaQa+X1UXwKxgHokB2XPxbX+AnijwIU4ahazAAAAAElFTkSuQmCC"
  
export default function ActionCard({
  data,
  cardState,
  onExecute,
  onReset,
  onReport
}: {
  data:any
  cardState: any
  onExecute: () => void;
  onReset: () => void;
  onReport: () => void;
}) {
  

  const shouldDisableButton = cardState?.dState || cardState?.eState || cardState?.isExecuting;
  const shouldShowSpinner = cardState?.isExecuting;

  /////////////////////////////////////////////////////////////
  ///////    controls which cards from data/actioncards   ////
  //////       should be diaplyed but disabled            ///
  //////////////////////////////////////////////////////////
  
  const shouldDisableCard = data.isDisabled;

  const url = `${data.project?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${"home"}`;
  
  return (
    <div className="relative rounded-lg border border-white pb-10 shadow-md transition-all hover:shadow-xl dark:border-white dark:hover:border-blue-600 }">
      <div
        
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="relative h-44 overflow-hidden">
          <div className="h-full flex items-center justify-center w-full">            
          {React.cloneElement(data.image, {
            style: {
              ...data.image.props.style,
              color: data.isDisabled ? grey[500] : blue[500],
            },  
          })}     
          </div>          
         
        </div>
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <h3 className="my-0 truncate font-cal text-lg font-bold tracking-wide dark:text-white dark:text-white">
            {data.name}
          </h3>
          <p className="mt-2 text-sm font-normal leading-relaxed text-stone-500 dark:text-stone-400">
            {data.description}
          </p>          
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
      {shouldDisableCard ? (
          // Show "Coming Soon" message if the card should be disabled
          <span className="text-blue-300 font-bold">Coming Soon</span>
        ) : (
          // show buttons if card is active
          <>
      <button
          onClick={onExecute}
          className={`relative flex items-center justify-center ${shouldDisableButton || shouldDisableCard ? "bg-blue-300 text-gray-500" : "bg-blue-500 text-white"} py-1 px-4 rounded-md`}
          disabled={shouldDisableButton} // Disable button if the card is disabled
        >
          {shouldShowSpinner ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></span>
            </span>
          ) : null}
          <span className={shouldShowSpinner ? "opacity-0" : "opacity-100"}>
            Execute
          </span>
        </button>
        <button
          onClick={onReset}
          className={!cardState?.eState ? "bg-blue-300 text-gray-500 py-1 px-4 rounded-md" : "bg-blue-500 text-white py-1 px-4 rounded-md"}
          disabled={!cardState?.eState} // Disable button if the card is disabled
        >
          Reset
        </button>
        <button
          onClick={onReport}
          className={!cardState?.eState ? "bg-blue-300 text-gray-500 py-1 px-4 rounded-md" : "bg-blue-500 text-white py-1 px-4 rounded-md"}
          disabled={!cardState?.eState} // Disable button if the card is disabled
        >
          View
        </button>
        </>
        )}
      </div>
    </div>        
  );
}
