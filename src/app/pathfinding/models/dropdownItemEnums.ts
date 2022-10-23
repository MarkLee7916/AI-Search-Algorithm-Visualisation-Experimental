export enum TilePlaceItem {
  Barrier = 'Barrier',
  RandomWeight = 'Random Weight',
  CustomWeight = 'Custom Weight',
}

export enum MazeGenItem {
  Random = 'Random Grid',
  FillGrid = 'Fill Grid',
  VerticalDivision = 'Vertical Division',
  HorizontalDivision = 'Horizontal Division',
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

export const DEFAULT_TILE_PLACE_ITEM = TilePlaceItem.Barrier;

export const DEFAULT_MAZE_GEN_ITEM = MazeGenItem.Random;

export const DEFAULT_USER_INTERACTION_MODE_ITEM =
  UserInteractionModeItem.Visualise;

export const DEFAULT_ALGO_ITEM = AlgoItem.Dijkstras;

export const DEFAULT_QUIZZABLE_ALGO_ITEM = QuizzableAlgoItem.Dijkstras;

export const DEFAULT_NEIGHBOURS_ITEM = NeighboursItem.NonDiagonals;

export const DEFAULT_TILE_DISPLAY_ITEM = TileDisplayItem.Weights;
