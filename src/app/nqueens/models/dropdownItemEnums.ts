export enum PruningAlgoItem {
  Node = 'Check Node Consistency',
  Arc = 'Check Arc Consistency',
}

export enum CheckingItem {
  Assigning = 'Check When Assigning',
  ForwardChecking = 'Use Forward Checking',
}

export enum VarHeuristicItem {
  InOrder = 'In Order',
  MostConstrained = 'Smallest Domain',
}

export enum UserInteractionModeItem {
  Visualise = 'Visualisation Mode',
  Quiz = 'Quiz Mode',
}

export enum ValHeuristicItem {
  InOrder = 'In Order',
  LeastConstraining = 'Least constraining',
}
