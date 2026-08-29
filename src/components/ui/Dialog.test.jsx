import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

import Dialog from "./Dialog.jsx";

function DialogHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open station map
      </button>
      {open && (
        <Dialog labelledBy="dialog-title" onClose={() => setOpen(false)}>
          <h2 id="dialog-title">Station map</h2>
          <button type="button">Secondary action</button>
        </Dialog>
      )}
    </>
  );
}

test("closes with Escape and returns focus to the opener", () => {
  render(<DialogHarness />);
  const opener = screen.getByRole("button", { name: "Open station map" });

  opener.focus();
  fireEvent.click(opener);
  expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();

  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(opener).toHaveFocus();
});
