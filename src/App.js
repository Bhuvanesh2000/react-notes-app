import React, { useEffect, useRef, useState, createRef } from "react";
import "./App.css";

function App() {
  const [notesList, setNotesList] = useState([]);
  const [editKey, setEditKey] = useState(-1);
  const [noteValue, setNoteValue] = useState("");
  const [create, setCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [deleteKey, setDeleteKey] = useState(-1);

  const deletePopupRefs = useRef([]);
  const cancelDeleteElement = useRef();
  const editFormElement = useRef();

  deletePopupRefs.current = notesList.map((note, key) => deletePopupRefs.current[key] ?? createRef());

  useEffect(() => {
    setSearchList(notesList.filter((val) => val.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  useEffect(() => {
    addFocusEvent(deleteKey);
  }, [deleteKey])

  const addFocusEvent = (index) => {
    deletePopupRefs.current[index]?.current?.focus();
  }

  const addClickEvent = (eType) => {
    switch (eType) {
      case "cancel_delete":
        cancelDeleteElement.current?.dispatchEvent(new Event("mousedown", { cancelable: true, bubbles: true }));
        break;
      default:
        break;
    }
  }

  const addSubmitEvent = (eType) => {
    switch (eType) {
      case "edit_form":
        editFormElement.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        break;
      default:
        break;
    }
  }

  const performSubmitAction = (value, index) => {
    setEditKey(-1);
    if (value.trim() !== "") {
      if (index > -1) {
        setNotesList(notesList.map((val, ind) => ind === index ? value : val))
      } else {
        setNotesList([...notesList, value]);
        setCreate((prevVal) => !prevVal);
      }
      setNoteValue("");
    }
  }

  const handleClickEvent = (e, index = -1) => {
    const eName = e.currentTarget.getAttribute("name");
    switch (eName) {
      case "edit":
        setEditKey(index);
        setCreate(false);
        break;
      case "confirm_delete":
        setDeleteKey(index);
        addFocusEvent();
        break;
      case "create":
        setCreate((prevVal) => !prevVal);
        break;
      case "close":
        setCreate(false);
        break;
      case "cancel_delete":
        setDeleteKey(-1);
        break;
      case "delete":
        setNotesList(notesList.filter((val, ind) => ind !== index))
        setDeleteKey(-1);
        break;
      default:
        break;
    }
  }

  const handleSubmitEvent = (e, index = -1) => {
    switch (e.type) {
      case "submit":
        performSubmitAction(e.target[0].value, index);
        break;
      case "blur":
        performSubmitAction(e.target.value, index);
        break;
      default:
        break;
    }
  }

  function handleChangeEvent(e) {
    const eName = e.currentTarget.getAttribute("name");
    const eValue = e.currentTarget.value;
    switch (eName) {
      case "search":
        setSearch(eValue);
        break;
      case "note":
        setNoteValue(eValue);
        break;
      default:
        break;
    }
  }

  function handleBlurEvent(e) {
    const eName = e.currentTarget.getAttribute("name");
    if (eName === "delete_popup") {
      addClickEvent("cancel_delete");
    }
    eName === "edit_note_form" && addSubmitEvent("edit_form");
  }

  function DisplayNotes({ notesList }) {
    return notesList.map(((note, key) =>
      <li key={key} className="mt-4">
        <div className="flex items-end">
          <i class="material-symbols-outlined mr-2">text_snippet</i>
          {editKey === key ?
            <form action="#" onSubmit={(e) => handleSubmitEvent(e, key)} className="flex items-end flex-1" onBlur={handleBlurEvent} name="edit_note_form" ref={editFormElement}>
              <div className="button-style button-style-gray w-full">
                <textarea className="scrollbar-gray align-top w-full rounded-md resize-none outline-none p-2 bg-transparent" rows={5} defaultValue={note} autoFocus></textarea>
              </div>
              <button type="submit" name="save" className="button-style button-style-green ml-2"><i class="material-symbols-outlined mr-1">done</i>Save</button>
            </form> :
            <>
              <pre className="flex-1 px-4 border border-transparent border-l-gray-900 rounded-md overflow-x-scroll">{note}</pre>
              <button name="edit" onClick={(e) => handleClickEvent(e, key)} className="button-style button-style-purple ml-2 ">
                <i class="material-symbols-outlined">edit_square</i>
              </button>
            </>
          }
          <button name="confirm_delete" onClick={(e) => handleClickEvent(e, key)} className="button-style button-style-red ml-2">
            <i class="material-symbols-outlined">delete</i>
          </button>
          {(deleteKey > -1) &&
            <div className={"disable-bg" + ((deleteKey === -1 || deleteKey !== key) ? " hidden" : "")}>
              <div className="popup-style" name="delete_popup" tabIndex="0" ref={deletePopupRefs.current[key]} onBlur={handleBlurEvent}>
                <div>Sure to delete?</div>
                <div className="flex flex-row justify-evenly w-full mt-4">
                  <button className="button-style button-style-green" onMouseDown={(e) => handleClickEvent(e, key)} name="delete">
                    <i class="material-symbols-outlined mr-1">done</i>
                    Yes
                  </button>
                  <button name="cancel_delete" onMouseDown={handleClickEvent} className="button-style button-style-red" ref={cancelDeleteElement}>
                    <i class="material-symbols-outlined mr-1">close</i>
                    No
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </li>
    ))
  }

  return (
    <div className={"App flex justify-center" + (deleteKey > -1 ? " disable-bg" : "")}>
      <div className="max-w-lg w-full">

        {notesList.length > 0 && <div className="button-style button-style-gray mb-2"><input type="text" placeholder="Search a note..." onChange={handleChangeEvent} name="search" className="rounded-md align-top w-full outline-none px-2 bg-transparent" /></div>}

        {create ?
          <form action="#" onSubmit={handleSubmitEvent} className="flex flex-col">
            <div className="button-style button-style-gray">
              <textarea onChange={handleChangeEvent} value={noteValue} placeholder="Enter a note..." name="note" rows={5} className="scrollbar-gray align-top w-full p-2 rounded-md resize-none outline-none bg-transparent" autoFocus></textarea>
            </div>
            <div className="flex w-full justify-between mt-2">
              <button type="submit" name="add_note" className="button-style button-style-green">
                <i class="material-symbols-outlined mr-1">done</i>
                Add Note
              </button>
              <button name="close" onClick={handleClickEvent} className="button-style button-style-red">
                <i class="material-symbols-outlined mr-1">close</i>
                Close
              </button>
            </div>
          </form> :
          <button onClick={handleClickEvent} name="create" className="button-style button-style-blue" style={{}}>
            <i class="material-symbols-outlined mr-1">add_box</i>
            Create Note
          </button>
        }

        <ul>
          {search === "" ? <DisplayNotes notesList={notesList} /> : <DisplayNotes notesList={searchList} />}
        </ul>
      </div>
    </div>
  );
}

export default App;
