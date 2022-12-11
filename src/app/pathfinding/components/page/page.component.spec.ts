import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { render, fireEvent, screen } from '@testing-library/angular';
import {
  assertNonNull,
  filterStr,
  isCharNumeric,
} from 'src/app/shared/genericUtils';
import { SharedModule } from 'src/app/shared/shared.module';
import { HEIGHT, WIDTH } from '../../models/grid';
import { PathfindingRoutingModule } from '../../pathfinding-routing-module';
import { CustomWeightInputComponent } from '../custom-weight-input/custom-weight-input.component';
import { TileComponent } from '../tile/tile.component';
import { TutorialModalComponent } from '../tutorial-modal/tutorial-modal.component';
import { PageComponent } from './page.component';

// TODO: use default variables to select dropdowns to make tests less brittle

describe('Pathfinding Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('moves animation frames properly when buttons pressed', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Get buttons to step back and forth through animations
    const prevAnimationFrameBtn = assertNonNull(
      document.getElementById('step-back-btn')
    );
    const nextAnimationFrameBtn = assertNonNull(
      document.getElementById('step-forward-btn')
    );

    // Step forward and check we're not on first animation frame
    fireEvent.click(nextAnimationFrameBtn);
    expect(screen.queryByText('Nothing has happened yet!')).toBeNull();

    // Step back and check we're back on first animation frame
    fireEvent.click(prevAnimationFrameBtn);
    expect(screen.queryByText('Nothing has happened yet!')).not.toBeNull();

    // Step back again and check we're still on first animation frame
    fireEvent.click(prevAnimationFrameBtn);
    expect(screen.queryByText('Nothing has happened yet!')).not.toBeNull();
  });

  it('moves through tutorial modal slides properly', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Expect tutorial modal to appear when app loaded
    expect(screen.queryByText(/Welcome/)).not.toBeNull();

    // Skip to last slide
    let nextSlideBtn = screen.queryByText('Next Slide');
    while (nextSlideBtn !== null) {
      fireEvent.click(nextSlideBtn);
      nextSlideBtn = screen.queryByText('Next Slide');
    }

    // Expect final slide to be displayed
    expect(screen.queryByText(/Everything/)).not.toBeNull();

    // Skip back to first slide
    let prevSlideBtn = screen.queryByText('Previous Slide');
    while (prevSlideBtn !== null) {
      fireEvent.click(prevSlideBtn);
      prevSlideBtn = screen.queryByText('Previous Slide');
    }

    // Expect first slide to be displayed
    expect(screen.queryByText(/Welcome/)).not.toBeNull();

    // Close tutorial and expect it to not be on screen
    const skipTutorialBtn = screen.getByText('Skip Tutorial');
    fireEvent.click(skipTutorialBtn);
    expect(screen.queryByText('Skip Tutorial')).toBeNull();
    expect(screen.queryByText('Finish Tutorial')).toBeNull();
    expect(screen.queryByText('Previous Slide')).toBeNull();
    expect(screen.queryByText('Next Slide')).toBeNull();
  });

  it('adds custom weights and performs proper checks on inputs', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to placing custom weights
    fireEvent.click(screen.getByText('Barrier ▼'));
    fireEvent.click(screen.getByText('Custom Weight'));

    // Click on a tile, displaying custom weight menu
    fireEvent.mouseDown(document.getElementsByClassName('tile')[0]);

    // Get the box for entering custom weights into and the buttom for submitting
    const customWeightInputBox = screen.getByRole('textbox');
    const submitCustomWeightBtn = screen.getByText('Add Custom Weight');

    // Attempt to submit a negative value and expect error message
    fireEvent.change(customWeightInputBox, { target: { value: '-1' } });
    fireEvent.click(submitCustomWeightBtn);
    expect(
      screen.queryByText('Input must be a positive number!')
    ).not.toBeNull();

    // Attempt to submit 0 and expect error message
    fireEvent.change(customWeightInputBox, { target: { value: '0' } });
    fireEvent.click(submitCustomWeightBtn);
    expect(
      screen.queryByText('Input must be a positive number!')
    ).not.toBeNull();

    // Attempt to submit a piece of text with no numbers and expect error message
    fireEvent.change(customWeightInputBox, { target: { value: 'mommaa' } });
    fireEvent.click(submitCustomWeightBtn);
    expect(
      screen.queryByText('Input must be a positive number!')
    ).not.toBeNull();

    // Attempt to submit an empty string and expect error message
    fireEvent.change(customWeightInputBox, { target: { value: '' } });
    fireEvent.click(submitCustomWeightBtn);
    expect(
      screen.queryByText('Input must be a positive number!')
    ).not.toBeNull();

    // Attempt to submit a weight and expect it to be displayed on the screen
    fireEvent.change(customWeightInputBox, { target: { value: '42' } });
    fireEvent.click(submitCustomWeightBtn);
    expect(screen.queryAllByText('42')).not.toBeNull();

    // Click on a tile, displaying custom weight menu
    fireEvent.mouseDown(document.getElementsByClassName('tile')[0]);

    // Enter a weight but close the menu without submitting and expect the weight not to be on the grid
    fireEvent.change(customWeightInputBox, { target: { value: '49' } });
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('49')).toBeNull();
  });

  it('draws walls on grid properly', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to displaying heuristic distance
    fireEvent.click(screen.getByText(/Display Weight/));
    fireEvent.click(screen.getByText('Display Heuristic Distance'));

    // Get tiles adjacent to goal and simulate placing walls there, so no path should be found
    const tilesAdjacentToGoal = screen
      .getAllByText('1')
      .map((elem) => assertNonNull(elem.parentNode));
    tilesAdjacentToGoal.forEach((tile) => fireEvent.mouseDown(tile));

    // Move a step in animation, forcing algorithm to recompute
    fireEvent.click(assertNonNull(document.getElementById('step-forward-btn')));

    // Get number of final animation frame
    const animationFrameStr = screen.getByText(/2 \//).innerHTML;
    const finalAnimationFrameNum =
      parseInt(filterStr(animationFrameStr, isCharNumeric).substring(1), 10) -
      1;

    // Move to last animation frame
    const stepThroughAnimFrameSlider = assertNonNull(
      document.getElementById('step-through-animation-frames')
    );
    fireEvent.input(stepThroughAnimFrameSlider, {
      target: { value: `${finalAnimationFrameNum}` },
    });

    // Expect no path to be found
    expect(screen.queryByText('No path found!')).not.toBeNull();
  });

  it('shows tooltip when hovering over a tile unless on first animation frame', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Hover over an arbitrary tile on the screen and expect it to not show tooltip
    const tile = assertNonNull(screen.getByText('⇒').parentNode);
    fireEvent.mouseEnter(tile);
    expect(screen.queryByText(/Calculated Distance/)).toBeNull();
    fireEvent.mouseLeave(tile);

    // Move to next anim frame, so no longer on first
    fireEvent.click(assertNonNull(document.getElementById('step-forward-btn')));

    // Hover over same tile again and expect tooltip to show this time
    fireEvent.mouseEnter(tile);
    expect(screen.queryByText(/Calculated Distance/)).not.toBeNull();
  });

  it('displays infinity symbol when displaying start distance on first frame', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to displaying start distance
    fireEvent.click(screen.getByText(/Display Weight/));
    fireEvent.click(screen.getByText('Display Start Distance'));

    // Expect every tile to have infinity symbol apart from start and goal
    expect(screen.getAllByText('∞').length).toBe(HEIGHT * WIDTH - 2);
  });

  it('Generates Weight Mazes', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to generating filled grid
    fireEvent.click(screen.getByText(/Random Grid/));
    fireEvent.click(screen.getByText('Fill Grid'));

    // Switch to placing weights
    fireEvent.click(screen.getByText('Barrier ▼'));
    fireEvent.click(screen.getByText('Random Weight'));

    // Generate Maze
    fireEvent.click(screen.getByText('Generate Maze'));

    // Get the inner display string of every tile
    const tileDisplays = Array.from(
      document.getElementsByClassName('tile')
    ).map((elem) => elem.children[0].innerHTML);

    // Expect every display string to be either a number or the start/goal symbol
    tileDisplays.forEach((display) =>
      expect(
        display === '⇒' || display === '🎯' || isCharNumeric(display)
      ).toBeTrue()
    );
  });

  it('can find path even though goal is surrounded by non-diagonals when in diagonal adjacency mode', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to displaying heuristic distance
    fireEvent.click(screen.getByText(/Display Weight/));
    fireEvent.click(screen.getByText('Display Heuristic Distance'));

    // Switch to displaying diagonal adjacency
    fireEvent.click(screen.getByText(/Non Diagonals Only/));
    fireEvent.click(screen.getByText('Diagonals Only'));

    // Get tiles adjacent to goal and simulate placing walls there, so no path should be found
    const tilesAdjacentToGoal = screen
      .getAllByText('1')
      .map((elem) => assertNonNull(elem.parentNode));
    tilesAdjacentToGoal.forEach((tile) => fireEvent.mouseDown(tile));

    // Move a step in animation, forcing algorithm to recompute
    fireEvent.click(assertNonNull(document.getElementById('step-forward-btn')));

    // Get number of final animation frame
    const animationFrameStr = screen.getByText(/2 \//).innerHTML;
    const finalAnimationFrameNum =
      parseInt(filterStr(animationFrameStr, isCharNumeric).substring(1), 10) -
      1;

    // Move to last animation frame
    const stepThroughAnimFrameSlider = assertNonNull(
      document.getElementById('step-through-animation-frames')
    );
    fireEvent.input(stepThroughAnimFrameSlider, {
      target: { value: `${finalAnimationFrameNum}` },
    });

    // Expect path to be found
    expect(screen.queryByText('Path found!')).not.toBeNull();
  });

  it('can find path even though goal is surrounded by non-diagonals when in all directions mode', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to displaying heuristic distance
    fireEvent.click(screen.getByText(/Display Weight/));
    fireEvent.click(screen.getByText('Display Heuristic Distance'));

    // Switch to displaying all directional adjacency
    fireEvent.click(screen.getByText(/Non Diagonals Only/));
    fireEvent.click(screen.getByText('All Directions'));

    // Get tiles adjacent to goal and simulate placing walls there, so no path should be found
    const tilesAdjacentToGoal = screen
      .getAllByText('1')
      .map((elem) => assertNonNull(elem.parentNode));
    tilesAdjacentToGoal.forEach((tile) => fireEvent.mouseDown(tile));

    // Move a step in animation, forcing algorithm to recompute
    fireEvent.click(assertNonNull(document.getElementById('step-forward-btn')));

    // Get number of final animation frame
    const animationFrameStr = screen.getByText(/2 \//).innerHTML;
    const finalAnimationFrameNum =
      parseInt(filterStr(animationFrameStr, isCharNumeric).substring(1), 10) -
      1;

    // Move to last animation frame
    const stepThroughAnimFrameSlider = assertNonNull(
      document.getElementById('step-through-animation-frames')
    );
    fireEvent.input(stepThroughAnimFrameSlider, {
      target: { value: `${finalAnimationFrameNum}` },
    });

    // Expect path to be found
    expect(screen.queryByText('Path found!')).not.toBeNull();
  });

  it('can find path after moving start and goal from surrounded position', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to displaying heuristic distance
    fireEvent.click(screen.getByText(/Display Weight/));
    fireEvent.click(screen.getByText('Display Heuristic Distance'));

    // Get tiles adjacent to goal and simulate placing walls there, so no path should be found
    const tilesAdjacentToGoal = screen
      .getAllByText('1')
      .map((elem) => assertNonNull(elem.parentNode));
    tilesAdjacentToGoal.forEach((tile) => fireEvent.mouseDown(tile));

    // Move goal away from surrounded position
    const goalTile = assertNonNull(screen.getByText('🎯').parentNode);
    const tileToMoveGoalTo = assertNonNull(
      screen.getAllByText('2')[0].parentNode
    );
    fireEvent.dragStart(goalTile);
    fireEvent.drop(tileToMoveGoalTo);

    // Get tiles adjacent to start and simulate placing walls there, so no path should be found
    const tilesAdjacentToStart = screen
      .getAllByText(`${HEIGHT + WIDTH - 6}`)
      .concat(screen.getAllByText(`${HEIGHT + WIDTH - 8}`))
      .map((elem) => assertNonNull(elem.parentNode));
    tilesAdjacentToStart.forEach((tile) => fireEvent.mouseDown(tile));

    // Move goal away from surrounded position
    const startTile = assertNonNull(screen.getByText('⇒').parentNode);
    const tileToMoveStartTo = assertNonNull(
      screen.getAllByText(`${HEIGHT + WIDTH - 9}`)[0].parentNode
    );
    fireEvent.dragStart(startTile);
    fireEvent.drop(tileToMoveStartTo);

    // Move a step in animation, forcing algorithm to recompute
    fireEvent.click(assertNonNull(document.getElementById('step-forward-btn')));

    // Get number of final animation frame
    const animationFrameStr = screen.getByText(/2 \//).innerHTML;
    const finalAnimationFrameNum =
      parseInt(filterStr(animationFrameStr, isCharNumeric).substring(1), 10) -
      1;

    // Move to last animation frame
    const stepThroughAnimFrameSlider = assertNonNull(
      document.getElementById('step-through-animation-frames')
    );
    fireEvent.input(stepThroughAnimFrameSlider, {
      target: { value: `${finalAnimationFrameNum}` },
    });

    // Expect path to be found
    expect(screen.queryByText('Path found!')).not.toBeNull();
  });

  it('clears barriers and weights', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to displaying heuristic distance
    fireEvent.click(screen.getByText(/Display Weight/));
    fireEvent.click(screen.getByText('Display Heuristic Distance'));

    // Place barriers on some tiles
    const tilesToPlaceBarriers = screen
      .getAllByText('1')
      .map((elem) => assertNonNull(elem.parentNode));
    tilesToPlaceBarriers.forEach((tile) => fireEvent.mouseDown(tile));

    // Switch to placing weights
    fireEvent.click(screen.getByText('Barrier ▼'));
    fireEvent.click(screen.getByText('Random Weight'));

    // Place weights on some tiles
    const tilesToPlaceWeights = screen
      .getAllByText('2')
      .map((elem) => assertNonNull(elem.parentNode));
    tilesToPlaceWeights.forEach((tile) => fireEvent.mouseDown(tile));

    // Expect some tiles to be gray
    expect(
      Array.from(document.getElementsByClassName('tile')).some(
        (tile) => (tile as HTMLElement).style.backgroundColor === 'gray'
      )
    ).toBeTrue();

    // Expect some tiles to have weights
    expect(
      Array.from(document.getElementsByClassName('tile')).some((tile) =>
        isCharNumeric(assertNonNull(tile.children[0] as HTMLElement).innerHTML)
      )
    ).toBeTrue();

    // Clear barriers and weights
    fireEvent.click(screen.getByText('Clear Barriers and Weights'));

    // Expect no tiles to be gray
    expect(
      Array.from(document.getElementsByClassName('tile')).every(
        (tile) => (tile as HTMLElement).style.backgroundColor !== 'gray'
      )
    ).toBeTrue();

    // Expect no tiles to have weights
    expect(
      Array.from(document.getElementsByClassName('tile')).every(
        (tile) =>
          !isCharNumeric(
            assertNonNull(tile.children[0] as HTMLElement).innerHTML
          )
      )
    ).toBeTrue();
  });

  it('changes algorithm', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Get number of final animation frame for BFS
    const finalAnimationFrameNumBFS =
      parseInt(
        filterStr(screen.getByText(/1 \//).innerHTML, isCharNumeric).substring(
          1
        ),
        10
      ) - 1;

    // Switch to GBFS
    fireEvent.click(screen.getByText(/Dijkstra/));
    fireEvent.click(screen.getByText('Greedy Best First Search'));

    // Move a step in animation, forcing algorithm to recompute
    fireEvent.click(assertNonNull(document.getElementById('step-forward-btn')));

    // Get number of final animation frame for GBFS
    const finalAnimationFrameNumGBFS =
      parseInt(
        filterStr(screen.getByText(/2 \//).innerHTML, isCharNumeric).substring(
          1
        ),
        10
      ) - 1;

    // Expect GBFS to be the new dropdown display
    expect(screen.getByText(/Greedy Best First Search/)).not.toBeNull();

    // Expect the number of animation frames for BFS to be greater than GBFS (since it explores more of grid)
    expect(finalAnimationFrameNumBFS).toBeGreaterThan(
      finalAnimationFrameNumGBFS
    );
  });

  it('Quiz mode works correctly', async () => {
    await render(PageComponent, {
      declarations: [
        TileComponent,
        PageComponent,
        TutorialModalComponent,
        CustomWeightInputComponent,
      ],
      imports: [
        CommonModule,
        PathfindingRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'pathfinding',
          component: PageComponent,
        },
      ],
    });

    // Switch to Quiz Mode
    fireEvent.click(screen.getByText(/Visualisation Mode/));
    fireEvent.click(screen.getByText('Quiz Mode'));

    // Attempt to click on wrong tile and expect failure message
    fireEvent.mouseDown(assertNonNull(screen.getByText('10').parentNode));
    expect(screen.getByText('Incorrect! Try again')).not.toBeNull();

    // Click on the right tiles until complete
    const correctTileDisplaySequence = [
      '⇒',
      '7',
      '19',
      '13',
      '',
      '',
      '',
      '6',
      '5',
      '28',
      '14',
      '7',
      '25',
      '29',
      '19',
      '3',
      '27',
      '20',
      '14',
      '',
      '🎯',
    ];
    correctTileDisplaySequence.forEach((tileDisplay) => {
      screen
        .getAllByText(tileDisplay)
        .map((elem) => elem.parentNode as HTMLElement)
        .filter((elem) => elem.className === 'tile')
        .forEach((tile) => {
          fireEvent.mouseDown(tile);
        });
    });

    // Expect quiz to be deemed solved with correct message displayed
    expect(screen.queryByText(/All guesses correct!/)).not.toBeNull();

    // Open algo menu and expect non quizzable algorithms to not be there
    fireEvent.click(screen.getByText(/Dijkstra/));
    expect(screen.queryByText(/Depth First Search/)).toBeNull();
    expect(screen.queryByText(/Breadth First Search/)).toBeNull();
    expect(screen.queryByText(/Random Search/)).toBeNull();
  });
});
