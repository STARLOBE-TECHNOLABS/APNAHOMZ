import { useAppStore } from "@/store/app";
import Wall from "./Wall";

const Walls = ({walls, removeWalls, updateWalls}) => {

  const activeElement = useAppStore(state => state.activeElement)
  const setEditorProp = useAppStore(state => state.setEditorProp)

  const handleClickActiveElement = (id) => {
    setActiveElement(id)
    setEditorProp('furniterMenu', false)
  }

  const setActiveElement = (id) => {
    setEditorProp('textEditing', false)
    setEditorProp('activeElement', id)
  }

  return (
    <g id='walls'>
        {walls.map(e => 
          <g key={e.id} onClick={() => handleClickActiveElement(e.id)}>
            <Wall walls={e.walls} id={e.id} color={e.color} setActiveElement={setActiveElement} activeElement={activeElement} removeWalls={removeWalls} updateWalls={updateWalls}/>
          </g>
        )}
    </g>
  )
}

export default Walls