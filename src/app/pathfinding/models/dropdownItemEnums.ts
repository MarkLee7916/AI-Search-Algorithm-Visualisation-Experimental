export enum TilePlaceItem {
  Barriers = 'Place Barriers',
  Weights = 'Place Weights',
}

export enum MazeGenItem {
  Random = 'Random Grid',
  FillGrid = 'Fill Grid',
}

export enum UserInteractionModeItem {
  Visualise = 'Visualisation Mode',
  Quiz = 'Quiz Mode',
}

export enum AlgoItem {
  Astar = 'A*',
  Dijkstras = 'Dijkstra',
  BFS = 'Breadth First Search',
  DFS = 'Depth First Search',
  GBFS = 'Greedy Best First Search',
  Random = 'Random Search',
}

export enum QuizzableAlgoItem {
  Astar = 'A*',
  Dijkstras = 'Dijkstra',
  GBFS = 'Greedy Best First Search',
}

export enum NeighboursItem {
  NonDiagonals = 'Non Diagonals Only',
  Diagonals = 'Diagonals Only',
  AllDirections = 'All Directions',
}

export enum TileDisplayItem {
  Weights = 'Display Weight',
  Dists = 'Display Start Distance',
  Heuristics = 'Display Heuristic Distance',
}
