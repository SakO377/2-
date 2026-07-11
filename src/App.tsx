import { useState } from 'react'
import Toolbar from './components/Toolbar'
import CourtBoard from './components/CourtBoard'
import StepsPanel from './components/StepsPanel'
import { useWhiteboard } from './hooks/useWhiteboard'
import { DEFAULT_DEFENSE_COLOR, DEFAULT_OFFENSE_COLOR } from './court/tokens'
import type { ToolId } from './court/tools'

function App() {
  const board = useWhiteboard()
  const [activeTool, setActiveTool] = useState<ToolId>('select')
  const [nextOffenseColor, setNextOffenseColor] = useState(DEFAULT_OFFENSE_COLOR)
  const [nextDefenseColor, setNextDefenseColor] = useState(DEFAULT_DEFENSE_COLOR)

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <header className="shrink-0 h-14 flex items-center px-4 border-b border-slate-200 bg-white">
        <h1 className="text-lg font-semibold text-slate-800">🏀 バスケットボール ホワイトボード</h1>
      </header>
      <div className="flex flex-1 min-h-0">
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          nextOffenseColor={nextOffenseColor}
          setNextOffenseColor={setNextOffenseColor}
          nextDefenseColor={nextDefenseColor}
          setNextDefenseColor={setNextDefenseColor}
          canUndo={board.canUndo}
          canRedo={board.canRedo}
          onUndo={board.undo}
          onRedo={board.redo}
          onClearAll={board.clearAll}
        />
        <main className="flex-1 min-w-0 flex items-center justify-center bg-slate-100 p-4">
          <div className="w-full h-full max-w-4xl">
            <CourtBoard
              step={board.step}
              activeTool={activeTool}
              nextOffenseColor={nextOffenseColor}
              nextDefenseColor={nextDefenseColor}
              addPlayer={board.addPlayer}
              addBall={board.addBall}
              setBallHolder={board.setBallHolder}
              movePlayer={board.movePlayer}
              moveBall={board.moveBall}
              addArrow={board.addArrow}
              deletePlayer={board.deletePlayer}
              deleteBall={board.deleteBall}
              deleteArrow={board.deleteArrow}
            />
          </div>
        </main>
        <StepsPanel />
      </div>
    </div>
  )
}

export default App
