import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReusableSelect from '../Inputs/ReusableSelect';

const Notes = ({ values, setValues, locked }) => {
  const getBuildingOptions = () => {
    const options = [{ value: 'Project', label: 'Project' }];

    if (values.buildings && values.buildings.length > 0) {
      values.buildings.forEach((_, index) => {
        const letter = String.fromCharCode(65 + index);
        options.push({
          value: `Building${letter}`,
          label: `Building ${letter}`,
        });
      });
    }

    return options;
  };

  const addNote = () => {
    setValues((prev) => ({
      ...prev,
      notes: [
        ...(prev.notes || []),
        {
          building: 'Project',
          text: '',
        },
      ],
    }));
  };

  const removeNote = (indexToRemove) => {
    setValues((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleNoteChange = (index, field, value) => {
    setValues((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) =>
        i === index ? { ...note, [field]: value } : note
      ),
    }));
  };

  return (
    <section className="card">
      <header className="cardHeader">
        <h3>Notes</h3>
      </header>

      {(values.notes || []).map((note, noteIndex) => {
        return (
          <Fragment key={`note-${noteIndex}`}>
            <div className="flexNotes">
              <ReusableSelect
                className="noteSelect"
                name={`note-building-${noteIndex}`}
                label="Scope:"
                labelClass="offOnLaptop"
                value={note.building}
                onChange={(e) =>
                  handleNoteChange(noteIndex, 'building', e.target.value)
                }
                options={getBuildingOptions()}
                disabled={locked}
              />
              <input
                type="text"
                className="noteText"
                value={note.text}
                onChange={(e) =>
                  handleNoteChange(noteIndex, 'text', e.target.value)
                }
                placeholder="Enter note text..."
                disabled={locked}
              />
              <button
                type="button"
                className="icon reject deleteRow noteDelete"
                onClick={() => removeNote(noteIndex)}
                disabled={locked}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="divider offOnTablet"></div>
          </Fragment>
        );
      })}

      {!locked && (
        <button
          type="button"
          className="success addRow noteAdd"
          onClick={addNote}
        >
          Add Note
        </button>
      )}
    </section>
  );
};

export default Notes;
