"use client"
import {useState, useEffect} from 'react'
import { useViewAction } from '@/app/providers'; // context provider
//import { getSession } from "@/lib/auth";
import ActionCard from "./action-card";


type ActionType = {
  id:           string     
  name:         string
  description:  string
  api:          string   
  image:        string
  createdAt:    Date   
  updatedAt:    Date
  isDisabled:   boolean 
  deactivatedAt: Date 
  eid:           number; // unique to each action
  eState:        boolean; // was the action executed
  dState:        boolean; // should the execution button be disabled
  isExecuting:   boolean; // is the action currently executing
  pre:          number[]
};


export default function Actions({
  projectId,
  limit,
}: {
  projectId?: string;
  limit?: number;
}) {

    //const [cardState, setCardState] = useState(actionsContent);  
    const [actionsWithProject, setActionsWithProject]  = useState([])
    const [actionsWithImages, setActionsWithImages] = useState<ActionType[]>([])

    // context provider for the action report number
    const { setActionSelected } = useViewAction();
    // context provider for the workflow
    const { workflowState, setWorkflowState } = useViewAction();


    // Complex function to test that prereqs have been executed
    // before a card can be execucted. This sets the disable state of the card
    async function updateStates(arr: any) {
      // Create a map of eid to eState for easy lookup

      return new Promise((resolve, reject) => {

        // build an array of objects from state with the card and associated 
        // state for execution.
        const eStateMap = arr.reduce((acc: any, cur: any) => {
          acc[cur.eid] = cur.eState;
          return acc;
        }, {});       
  
      // Create a new array of objects with updated dState
        const newArr = arr.map((obj: any) => {
          // If the prerequisite array is empty, then dState is false
          // In other words, the execution button is not disabled
          if (obj.pre.length === 0) {
              return {...obj, dState: false};
          }
  
          // Check if all prerequisite eStates are true
          const allPreTrue = obj.pre.every((eid: any) => eStateMap[eid]);
  
          // Set dState based on the prerequisite eStates
          // If all prerequisite work is completed (eState == true) then enabled execution button
          return {...obj, dState: !allPreTrue };
        });
  
      resolve(newArr)

      })
      
    }   

    // triggers when a card is selected for execution
    // note that the card state is reset to reflect progression of work
    // currently mocked up and not tied to api   

    const handleExecute = async (eid: number) => {
      // Use functional update to ensure we always work with the latest state.
      setWorkflowState((prevState) => 
        prevState.map((card) => 
          card.eid === eid ? { ...card, isExecuting: true } : card
        )
      );
    
      // Generate a temporary new state based on the action.
      const tempState = await updateStates(workflowState.map((card) => 
        card.eid === eid ? { ...card, isExecuting: true } : card
      )) as ActionType[];
    
      // Set the new temporary state
      setWorkflowState(tempState);
    
      // Execute the delayed actions within a setTimeout.
      const timeoutId = setTimeout(async () => {
        // Again use functional update to modify the state.
        const postExecutionState = await updateStates(tempState.map((card) => {
          if (card.eid === eid) {
            return {
              ...card,
              isExecuting: false, // Execution is finished
              dState: true,       // Disabling the button 
              eState: true,       // Indicating the function was executed
            };
          }
          return card;
        })) as ActionType[];
    
        setWorkflowState(postExecutionState);
      }, 3000);
    
      // Cleanup function to clear the timeout if the component is unmounted before timeout completes.
      return () => {
        clearTimeout(timeoutId);
      };
    };
    
    const handleReset = async (eid: number) => {
      // Create a new temporary state based on the action.
      const tempState = workflowState.map((card) => {
        if (card.eid === eid) {
          return {
            ...card,
            eState: false,
            dState: true
          };
        }
        return card;
      });
    
      // Check other objects to see if this card is a prerequisite
      // if it is --- reset their states as well
      const newStateAfterPreCheck = tempState.map((card) => {
        if (card.pre.includes(eid)) {
          return {
            ...card,
            dState: true,
            eState: false
          };
        }
        return card;
      });
    
      // Update the state using updateStates function.
      const newCardState = await updateStates(newStateAfterPreCheck) as ActionType[];
      
      // Finally, set the updated state.
      setWorkflowState(newCardState);
      
      // Reset the side nav bar.
      setActionSelected(0);
    };
    

    const handleReport = async (eid: number) => {
      console.log(` Selected action ${eid} and project ${projectId}`);
      setActionSelected(eid); // Set the context value to the selected action's eid
     
    }    
   
    ////////////////////////////////////////////////
    /////    REFACTOR THIS PROCESS           //////
    //////     DATABASE NEEDS UPDATING       /////
    ////  this reads from sql DB. but using   ///
    ///   card array from providers context   //
    /////////////////////////////////////////////
    // fetch all actions associated with a project when component mounts
    useEffect(() => {
      // in your component or util file
      const fetchActions = async(projectId: any, limit: any) => {

        try {
          const res = await fetch('/api/fetchActions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId, limit }),
          });  
          if (res.ok) {
            let response = await res.json();
            
            setActionsWithProject(response)
          
          } else {
            const error = new Error('An error occurred while fetching the data.');
            
            throw error;
          }

        } catch(error) {
          throw error

        }   
      }
      fetchActions(projectId, limit)
    }, [])  
    
  ////////////////////////////////////////////////////////////////////
  ////   TEMPORARY FIX UNTIL SCHEMA UPDATE AND SEED MOVED TO DB  ////
  ////        rather than merging in card array from provider    ////
  ///     this ignores cards from db and just used card array    ///
  //////////////////////////////////////////////////////////////////
   useEffect(() => {
    // const actionsUpdated = actionsWithProject.map((obj1: any) => {
    //   const matchingObj = workflowState.find(obj2 => obj2.name == obj1.name)
    //   return matchingObj ? {...obj1, image: matchingObj.image, eid: matchingObj.eid, eState: matchingObj.eState, dState: matchingObj.dState, isExecuting: matchingObj.isExecuting } : {...obj1, image: "/placeholder.png", eid: 0, eState: false, dState: true, isExecuting: false}
    // })
    setActionsWithImages([...workflowState]);
  }, [actionsWithProject]);
 
 
  return  (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
       {actionsWithImages.map((action: any, index: any) => (
        <ActionCard 
          key={index} 
          data={action} 
          cardState={workflowState.find((c) => c.eid == action.eid)} 
          onExecute={() => handleExecute(action.eid)} 
          onReset= {() => handleReset(action.eid)}
          onReport= {() => handleReport(action.eid)}
          />
      ))}
    </div>
  ) 
}
