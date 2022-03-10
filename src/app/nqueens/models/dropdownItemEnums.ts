export enum PruningAlgoItem {
  Node = 'Check Node Consistency',
  Arc = 'Check Arc Consistency',
}

export enum CheckingItem {
  Assigning = 'Check When Assigning',
  ForwardChecking = 'Use Forward Checking',
}

export enum VarHeuristicItem {
  InOrder = 'Takes Rows In Order',
  MostConstrained = 'Take Most Constrained Row',
}

export enum ValHeuristicItem {
  InOrder = 'Take Columns In Order',
  LeastConstraining = 'Take Least Constraining Column',
}

export enum DomainDisplayItem {
  All = 'Display Domains of All Rows',
  CurrentRow = 'Display Domain Being Changed',
  None = 'Display No Domains',
}
