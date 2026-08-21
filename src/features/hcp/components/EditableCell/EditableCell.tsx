import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../../../app/store";

import { startEdit, cancelEdit, editRejected } from "../../hcpSlice";

import type { RowKey } from "../../hcpTypes";

import "./EditableCell.css";

interface EditableCellProps {
  rowKey: RowKey;
  value: number | string;
}

export function EditableCell({ rowKey, value }: EditableCellProps) {
  const dispatch = useDispatch();

  const edit = useSelector(
    (state: RootState) => state.hcp.edits[String(rowKey)],
  );

  const numericValue = Number(value);

  const [inputValue, setInputValue] = useState(String(value));

  const handleStartEdit = () => {
    if (edit) {
      return;
    }

    dispatch(
      startEdit({
        rowKey,
        field: "calls",
        originalValue: numericValue,
        value: numericValue,
        status: "editing",
        requestId: crypto.randomUUID(),
      }),
    );

    setInputValue(String(value));
  };

  const validate = (newValue: number): string | null => {
    if (!Number.isFinite(newValue)) {
      return "Calls must be a valid number";
    }

    if (!Number.isInteger(newValue)) {
      return "Calls must be an integer";
    }

    if (newValue < 0) {
      return "Calls cannot be negative";
    }

    return null;
  };

  const handleSave = () => {
    const newValue = Number(inputValue);

    const error = validate(newValue);

    if (error) {
      if (edit) {
        dispatch(
          editRejected({
            rowKey,
            requestId: edit.requestId,
            error,
          }),
        );
      }

      return;
    }

    console.log("Value ready to save:", newValue);
  };

  const handleCancel = () => {
    dispatch(cancelEdit(rowKey));

    setInputValue(String(value));
  };

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
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSave();
          }

          if (event.key === "Escape") {
            handleCancel();
          }
        }}
        onBlur={handleSave}
      />

      {edit.status === "rejected" && (
        <span className="edit-error" title={edit.error}>
          ⚠
        </span>
      )}
    </div>
  );
}
