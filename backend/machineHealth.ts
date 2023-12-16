import { Request } from 'express';
import {
  AssemblyLinePart,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart,
  partInfo,
} from '../native-app/data/types';
import { calculateMachineHealth } from './calculations';

export const getMachineHealth = (req: Request) => {
  /* Assuming the request body contains the machine's name and parts data in the format of
  {
    "machines": {
      "assemblyLine": {
        "alignmentAccuracy": 0.5
      },
      "weldingRobot": {
        "vibrationLevel": 4.0,
        "electrodeWear": 0.8,
      }
    }
  }
  */
  console.log("inside the getMachineHealth")
  const {
    machines,
  }: {
    machines: Record<
      MachineType,
      Record<
        | WeldingRobotPart
        | AssemblyLinePart
        | PaintingStationPart
        | QualityControlStationPart,
        string
      >
    >;
  } = req.body;

  if (!machines) {
    return { error: 'Invalid input format' };
  }

  const machineScores: {
    [key in MachineType]?: string;
  } = {};
  let factoryScore = 0;
  let machineCount = 0;

  // Calculate scores for each machine
  for (const machineName in machines) {
    const machine = machines[machineName as MachineType] as Record<
      | WeldingRobotPart
      | AssemblyLinePart
      | PaintingStationPart
      | QualityControlStationPart,
      string
    >;
    const machineScore = calculateMachineHealth(
      machineName as MachineType,
      Object.keys(machine).reduce((parts: partInfo[], partName) => {
        const partNameTyped = partName as
          | WeldingRobotPart
          | AssemblyLinePart
          | PaintingStationPart
          | QualityControlStationPart;
        parts.push({
          name: partNameTyped,
          value: parseFloat(machine[partNameTyped]),
        });
        console.log(parts)
        return parts;
      }, []),
    );

    machineScores[machineName as MachineType] = machineScore.toFixed(2);

    factoryScore += machineScore;
    machineCount++;
  }
  console.log("factoryscore", factoryScore)
  console.log("machine count", machineCount)

  // Calculate the factory score (average of machine scores)
  factoryScore = machineCount > 0 ? factoryScore / machineCount : 0;

  return {
    factory: factoryScore.toFixed(2),
    machineScores,
  };
};
