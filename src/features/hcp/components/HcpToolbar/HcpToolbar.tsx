import { useDispatch, useSelector } from "react-redux";

import { undo, redo } from "../../hcpSlice";
import { RootState } from "../../../../app/store";

export function HcpToolbar() {
  const dispatch = useDispatch();

  const undoCount = useSelector(
    (state: RootState) => state.hcp.history.undoStack.length,
  );

  const redoCount = useSelector(
    (state: RootState) => state.hcp.history.redoStack.length,
  );

  return (
    <div className="hcp-toolbar">
      <button
        type="button"
        disabled={undoCount === 0}
        onClick={() => dispatch(undo())}
      >
        Undo
      </button>

      <button
        type="button"
        disabled={redoCount === 0}
        onClick={() => dispatch(redo())}
      >
        Redo
      </button>
    </div>
  );
}
