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

function UpdatingHandlerHarness() {
  const [message, setMessage] = useState("Waiting");
  const [closeMessage, setCloseMessage] = useState("First handler");

  return (
    <>
      <p>{message}</p>
      <button onClick={() => setCloseMessage("Latest handler")} type="button">
        Update close handler
      </button>
      <Dialog
        labelledBy="updating-dialog-title"
        onClose={() => setMessage(closeMessage)}
      >
        <h2 id="updating-dialog-title">Updating handler</h2>
      </Dialog>
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

test("uses the latest close handler without re-registering the dialog effect", () => {
  render(<UpdatingHandlerHarness />);

  fireEvent.click(screen.getByRole("button", { name: "Update close handler" }));
  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.getByText("Latest handler")).toBeInTheDocument();
});
