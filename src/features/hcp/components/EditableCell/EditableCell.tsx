import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  startEdit,
  setEditPending,
  editAccepted,
  editRejected,
  cancelEdit,
} from "../../hcpSlice";

import type { RowKey } from "../../hcpTypes";
import { RootState } from "../../../../app/store";
import "./EditableCell.css";
import { validateCalls } from "../../../../mock-validator";

interface EditableCellProps {
  rowKey: RowKey;
  value: number | string;
}

export function EditableCell({ rowKey, value }: EditableCellProps) {
  const dispatch = useDispatch();

  const edit = useSelector(
    (state: RootState) => state.hcp.edits[String(rowKey)],
  );

  const [inputValue, setInputValue] = useState(String(value));

  const numericValue = Number(value);

  // -------------------------
  // Start editing
  // -------------------------

  const handleStartEdit = () => {
    if (edit) {
      return;
    }

    const requestId = crypto.randomUUID();

    dispatch(
      startEdit({
        rowKey,
        field: "calls",
        originalValue: numericValue,
        value: numericValue,
        status: "editing",
        requestId,
      }),
    );

    setInputValue(String(value));
  };

  // -------------------------
  // Save
  // -------------------------

  const handleSave = async () => {
    if (!edit) {
      return;
    }

    const newValue = Number(inputValue);

    const requestId = crypto.randomUUID();

    dispatch(
      startEdit({
        rowKey,
        field: "calls",
        originalValue: edit.originalValue,
        value: newValue,
        status: "editing",
        requestId,
      }),
    );

    dispatch(
      setEditPending({
        rowKey,
        requestId,
      }),
    );

    try {
      await validateCalls(newValue);

      dispatch(
        editAccepted({
          rowKey,
          requestId,
          value: newValue,
        }),
      );
    } catch (error) {
      dispatch(
        editRejected({
          rowKey,
          requestId,
          error: String(error),
        }),
      );
    }
  };

  // -------------------------
  // Cancel
  // -------------------------

  const handleCancel = () => {
    dispatch(cancelEdit(rowKey));

    setInputValue(String(value));
  };

  // -------------------------
  // Normal state
  // -------------------------

  if (!edit) {
    return (
      <div
        className="table-cell numeric editable-cell"
        onDoubleClick={handleStartEdit}
        title="Double-click to edit"
      >
        {numericValue.toLocaleString()}
      </div>
    );
  }

  // -------------------------
  // Editing / Pending / Rejected
  // -------------------------

  return (
    <div
      className={`table-cell numeric editable-cell ${
        edit.status === "pending"
          ? "pending"
          : edit.status === "rejected"
            ? "rejected"
            : ""
      }`}
    >
      <input
        type="number"
        value={inputValue}
        autoFocus
        disabled={edit.status === "pending"}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleSave();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            handleCancel();
          }
        }}
      />

      {edit.status === "pending" && (
        <span className="edit-pending">Saving...</span>
      )}

      {edit.status === "rejected" && (
        <span className="edit-error" title={edit.error}>
          ⚠
        </span>
      )}
    </div>
  );
}
