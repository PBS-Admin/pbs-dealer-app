import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import ReusableSelect from '../Inputs/ReusableSelect';
import { useBuildingContext } from '@/contexts/BuildingContext';

const Notes = ({ locked }) => {
  // Contexts
  const { state, handleChange, addNote, removeNote, handleNoteChange } =
    useBuildingContext();

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
    <>
      <section className="card">
        <header className="cardHeader">
          <h3>Standard Notes</h3>
        </header>
        <div className="grid3 alignTop">
          <div className="grid">
            <h4 className="top">By Others Notes</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteCMUWallByOthers"
                  name="noteCMUWallByOthers"
                  checked={state.noteCMUWallByOthers}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="noteCMUWallByOthers">
                  CMU Walls - By Others
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="notePlywoodLinerByOthers"
                  name="notePlywoodLinerByOthers"
                  checked={state.notePlywoodLinerByOthers}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="notePlywoodLinerByOthers">
                  Plywood Liner - By Others
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteMezzanineByOthers"
                  name="noteMezzanineByOthers"
                  checked={state.noteMezzanineByOthers}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="noteMezzanineByOthers">
                  Mezzanine - By Others
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteFirewallByOthers"
                  name="noteFirewallByOthers"
                  checked={state.noteFirewallByOthers}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="noteFirewallByOthers">
                  Firewall - By Others
                </label>
              </div>
            </div>
          </div>

          <div className="grid">
            <h4 className="top">Disclaimer Notes</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteExtBldgDisclaimer"
                  name="noteExtBldgDisclaimer"
                  checked={state.noteExtBldgDisclaimer}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="noteExtBldgDisclaimer">
                  Existing Buildings Disclaimer
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteRoofPitchDisclaimer"
                  name="noteRoofPitchDisclaimer"
                  checked={state.noteRoofPitchDisclaimer}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="noteRoofPitchDisclaimer">
                  PBR Roofing with 1/2:12 Roof Pitch
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteSeismicGapDisclaimer"
                  name="noteSeismicGapDisclaimer"
                  checked={state.noteSeismicGapDisclaimer}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="noteSeismicGapDisclaimer">
                  Seismic Gap Disclaimer
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteWaterPondingDisclaimer"
                  name="noteWaterPondingDisclaimer"
                  checked={state.noteWaterPondingDisclaimer}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="noteWaterPondingDisclaimer">
                  Water Ponding Disclaimer
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteBldgSpecsDisclaimer"
                  name="noteBldgSpecsDisclaimer"
                  checked={state.noteBldgSpecsDisclaimer}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="noteBldgSpecsDisclaimer">
                  Building With Spec's
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <header className="cardHeader">
          <h3>Custom Notes</h3>
        </header>

        {(state.notes || []).map((note, noteIndex) => {
          return (
            <Fragment key={`note-${noteIndex}`}>
              <div className="flexNotes">
                <ReusableSelect
                  className="noteSelect"
                  name={`note-building-${noteIndex}`}
                  labelClass="hidden"
                  value={note.building}
                  onChange={(e) => handleNoteChange(noteIndex, 'building', e)}
                  options={getBuildingOptions()}
                  disabled={locked}
                />
                <textarea
                  name="noteText"
                  className="noteText"
                  value={note.text}
                  rows={4}
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
            </Fragment>
          );
        })}

        {!locked && (
          <div className="buttonFooter">
            <button
              type="button"
              className="addButton noteAdd"
              onClick={addNote}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Notes;
