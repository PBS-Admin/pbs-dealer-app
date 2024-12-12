import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReusableSelect from '../Inputs/ReusableSelect';
import { useBuildingContext } from '@/contexts/BuildingContext';

const Notes = ({ locked }) => {
  // Contexts
  const { state, addNote, removeNote, handleNoteChange } = useBuildingContext();

  // Local Functions
  const getBuildingOptions = () => {
    const options = [{ value: 'Project', label: 'Project' }];

    if (state.buildings && state.buildings.length > 0) {
      state.buildings.forEach((_, index) => {
        const letter = String.fromCharCode(65 + index);
        options.push({
          value: `Building${letter}`,
          label: `Building ${letter}`,
        });
      });
    }

    return options;
  };

  return (
    <section className="card">
      <header className="cardHeader">
        <h3>Notes</h3>
      </header>

      {(state.notes || []).map((note, noteIndex) => {
        return (
          <Fragment key={`note-${noteIndex}`}>
            <div className="flexNotes">
              <ReusableSelect
                className="noteSelect"
                name={`note-building-${noteIndex}`}
                label="Scope:"
                labelClass="offOnLaptop"
                value={note.building}
                onChange={(e) => handleNoteChange(noteIndex, 'building', e)}
                options={getBuildingOptions()}
                disabled={locked}
              />
              <input
                type="text"
                className="noteText"
                value={note.text}
                onChange={(e) => handleNoteChange(noteIndex, 'text', e)}
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
